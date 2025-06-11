import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';
import useLogout from '@/hooks/useLogout';
import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import CardGrid from '@/components/ui/CardGrid';
import rabbit from '@/asset/img/diagnosis/smallRabbit.png';

import { fetchRoadmap } from '@/api/roadmapService';
import { fetchSubjectDetail, SubjectDetail } from '@/hooks/useSubjectDetail';
import { FeedbackItem, fetchUserFeedback } from '@/hooks/useReport';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface FeedbackItemWithSubjectId extends FeedbackItem {
  info: FeedbackItem['info'] & { subjectId: number };
}

interface ReportCard {
  title: string;
  detailUrl: string;
  button1?: string;
  subtitle?: string;
  subjectId: number;
}

function MyPage() {
  const logout = useLogout();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'favorite' | 'report'>('favorite');
  const { data: progressData } = useProgress();
  const percent = Math.min(100, Math.round(progressData?.percent || 0));

  const { data: roadmap } = useQuery({
    queryKey: ['myRoadmap'],
    queryFn: () => fetchRoadmap(),
  });

  const subjectIds = roadmap?.subjects.map((s) => s.subjectId) ?? [];

  const subjectDetailsResults = useQueries({
    queries: subjectIds.map((id) => ({
      queryKey: ['subjectDetail', id],
      queryFn: () => fetchSubjectDetail(id),
      enabled: !!id,
    })),
  });

  const cardList = subjectDetailsResults
    .filter((r): r is UseQueryResult<SubjectDetail, Error> & { data: SubjectDetail } =>
      r.status === 'success' &&
      !!r.data?.recommendContents?.length &&
      r.data.preSubmitCount > 0
    )
    .flatMap((r) =>
      r.data.recommendContents!.map((content) => ({
        title: content.title,
        detailUrl: content.url,
        button1: '바로가기',
        subtitle: `${content.platform} · ${content.type}`,
        price: content.price,
        isAiRecommendation: content.isAiRecommendation,
      }))
    );

  // subjectId 포함시켜서 반환
  const feedbackResults = useQueries({
    queries: subjectIds.map((subjectId) => ({
      queryKey: ['userFeedback', subjectId],
      queryFn: async () => {
        const data = await fetchUserFeedback(subjectId);
        return { data, subjectId }; // subjectId 포함
      },
      enabled: !!subjectId,
    })),
  });

  // 사전 평가만 완료한 subjectId
  const evaluatedSubjectIds = subjectDetailsResults
    .filter(
      (r): r is UseQueryResult<SubjectDetail, Error> & { data: SubjectDetail } =>
        r.status === 'success' && r.data.preSubmitCount > 0
    )
    .map((r) => r.data.subjectId);

  // 정확한 subjectId 매핑을 기반으로 피드백 리스트 생성
  const feedbackDataList: FeedbackItemWithSubjectId[] = [];

  feedbackResults.forEach((r) => {
    if (r.status === 'success' && r.data?.data?.length) {
      const { data, subjectId } = r.data;
      const enriched = data.map((fb) => ({
        ...fb,
        info: {
          ...fb.info,
          subjectId,
        },
      }));
      feedbackDataList.push(...enriched);
    }
  });

  const reportCardsMap = new Map<number, ReportCard>();

  feedbackDataList
    .filter((fb) => evaluatedSubjectIds.includes(fb.info.subjectId))
    .forEach((fb) => {
      const subjectId = fb.info.subjectId;
      const existing = reportCardsMap.get(subjectId);

      if (
        !existing ||
        new Date(fb.info.date) > new Date(existing.subtitle?.replace('제출일: ', '') || '')
      ) {
        reportCardsMap.set(subjectId, {
          title: `${fb.info.subject}`,
          detailUrl: `/report?subject=${fb.info.subject}&date=${fb.info.date}`,
          button1: '리포트 보러가기',
          subtitle: `제출일: ${fb.info.date}`,
          subjectId,
        });
      }
    });

  const reportCards = Array.from(reportCardsMap.values());

  return (
    <div className="flex flex-col min-h-screen font-[pretendard] w-full px-4 sm:px-0">
      <div className="flex-grow">
        <div className="w-full flex justify-between items-center mb-2 mt-8">
          <div className="flex">
            <img src={rabbit} alt="smallRabbit" className="w-[30px] mr-2" />
            <p className="text-[20px] font-bold">{progressData?.roadmapName}</p>
          </div>
        </div>

        <div className="w-full mb-13">
          <div className="mb-4 text-[20px] font-medium">
            {progressData?.nickname}님, 오늘도 학습을 진행해볼까요?
            <br className="block sm:hidden" />
            <span className="block sm:inline font-bold mt-1 sm:mt-0 text-left w-full">{percent}%</span>
          </div>
          <div className="w-full max-w-md flex items-center gap-2 pr-2">
            <div className="w-full h-6 border-2 border-[#59C5CD] px-[3px] py-[3px] box-border">
              <div className="h-full bg-[#C6EDF2]" style={{ width: `${percent}%` }}></div>
            </div>
            <span className="text-[#59C5CD] text-sm font-medium whitespace-nowrap font-[NeoDunggeunmo]">
              {progressData?.completeCnt}/{progressData?.subCnt} 완료
            </span>
          </div>
        </div>

        {/* 탭 */}
        <div className="inline-flex rounded-lg bg-[#f3f6fb] p-1 mb-5">
          <button
            onClick={() => setActiveTab('favorite')}
            className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'favorite' ? 'bg-white text-gray-900 font-semibold shadow-sm' : 'text-gray-500'}`}
          >
            추천 콘텐츠
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'report' ? 'bg-white text-gray-900 font-semibold shadow-sm' : 'text-gray-500'}`}
          >
            평가 리포트
          </button>
        </div>

        {/* 콘텐츠 */}
        {activeTab === 'favorite' ? (
          <CardGrid
            cards={cardList}
            onButton1Click={(card) => window.open(card.detailUrl, '_blank')}
          />
        ) : (
          <CardGrid
            cards={reportCards}
            onButton1Click={(card) => {
              navigate(`/solution?subjectId=${card.subjectId}`);
            }}
          />
        )}
      </div>

      {/* 푸터 */}
      <div className="mt-auto w-full max-w-md mx-auto py-4 text-center">
        <button onClick={logout} className="mr-2">로그아웃</button>
        <span className="mx-2">|</span>
        <button className="ml-2">회원탈퇴</button>
      </div>
    </div>
  );
}

export default MyPage;
