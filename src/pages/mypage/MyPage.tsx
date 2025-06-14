import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';
import useLogout from '@/hooks/useLogout';
import { useEffect, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import CardGrid from '@/components/ui/CardGrid';
import ReportCard from '@/components/ui/reportCard';
import rabbit from '@/asset/img/diagnosis/smallRabbit.png';

import { fetchRoadmap } from '@/api/roadmapService';
import { fetchSubjectDetail, SubjectDetail } from '@/hooks/useSubjectDetail';
import { FeedbackItem, fetchUserFeedback } from '@/hooks/useReport';
import { useInterviewHistory } from '@/hooks/useInterviewHistory';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface FeedbackItemWithSubjectId extends FeedbackItem {
  subjectId: number;
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
  const [activeTab, setActiveTab] = useState<'favorite' | 'report' | 'speechFeedback'>('favorite');
  const { data: progressData } = useProgress();
  const percent = Math.min(100, Math.round(progressData?.percent || 0));
  const { data: speechData = [], isLoading: speechLoading } = useInterviewHistory();

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
        subjectId, // 평탄화된 필드
      }));

      feedbackDataList.push(...enriched);
    }
  });

  const reportCardsMap = new Map<number, ReportCard>();

  feedbackDataList
    .filter((fb) => evaluatedSubjectIds.includes(fb.subjectId))
    .forEach((fb) => {
      const subjectId = fb.subjectId;
      const existing = reportCardsMap.get(subjectId);

      if (
        !existing ||
        new Date(fb.date) > new Date(existing.subtitle?.replace('제출일: ', '') || '')
      ) {
        reportCardsMap.set(subjectId, {
          title: `${fb.subject}`,
          detailUrl: `/report?subject=${fb.subject}&date=${fb.date}`,
          button1: '리포트 보러가기',
          subtitle: `제출일: ${fb.date}`,
          subjectId,
        });
      }
    });

  const reportCards = Array.from(reportCardsMap.values());

  //중복제거
  const uniqueNthMap = new Map<number, typeof speechData[0]>();

  speechData.forEach((item) => {
    if (!uniqueNthMap.has(item.nth)) {
      uniqueNthMap.set(item.nth, item); 
    }
  });

  // 중복 제거된 speechCards 생성
  const speechCards = Array.from(uniqueNthMap.values()).map((item) => ({
    reply_id: item.reply_id,
    nth: item.nth,
    interviewContent: item.interviewContent,
    userReply: item.userReply,
    aiFeedback: item.aiFeedback,
    subId: item.subId,
    interviewAnswer: item.interviewAnswer,
  }));

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

        {/* 탭뷰 */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('favorite')}
            className={`mr-4 pb-2 border-b-2 ${activeTab === 'favorite'
              ? 'border-[#6378EB] text-[#6378EB] font-bold'
              : 'border-transparent text-gray-500'
              }`}
          >
            추천 콘텐츠
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`mr-4 pb-2 border-b-2 ${activeTab === 'report'
              ? 'border-[#6378EB] text-[#6378EB] font-bold'
              : 'border-transparent text-gray-500'
              }`}
          >
            평가 리포트
          </button>
          <button
            onClick={() => setActiveTab('speechFeedback')}
            className={`pb-2 border-b-2 ${activeTab === 'speechFeedback'
              ? 'border-[#6378EB] text-[#6378EB] font-bold'
              : 'border-transparent text-gray-500'
              }`}
          >
            인터뷰 리포트
          </button>
        </div>

        {/* 콘텐츠 */}

        {
          activeTab === 'favorite' ? (
            <CardGrid
              cards={cardList}
              onButton1Click={(card) => window.open(card.detailUrl, '_blank')}
            />
          ) : activeTab === 'report' ? (
            <CardGrid
              cards={reportCards}
              onButton1Click={(card) => {
                navigate(`/solution?subjectId=${card.subjectId}`);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {speechCards.length === 0 ? (
                <p className="text-gray-500">면접 기록이 없습니다.</p>
              ) : (
                speechCards.map((item) => (
                  <ReportCard key={item.reply_id} item={item} />
                ))
              )}
            </div>
          )
        }


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
