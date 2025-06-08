import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';
import useLogout from '@/hooks/useLogout';
import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import CardGrid from '@/components/ui/CardGrid';
import rabbit from '@/asset/img/diagnosis/smallRabbit.png';

import { fetchRoadmap } from '@/api/roadmapService';
import { fetchSubjectDetail, SubjectDetail } from '@/hooks/useSubjectDetail';
import { FeedbackItem, fetchUserFeedback } from '@/hooks/useReport';

function MyPage() {
  const logout = useLogout();
  const [activeTab, setActiveTab] = useState<'favorite' | 'report'>('favorite');
  const { data: progressData } = useProgress();
  const percent = Math.min(100, Math.round(progressData?.percent || 0));

  // 로드맵 조회
  const { data: roadmap } = useQuery({
    queryKey: ['myRoadmap'],
    queryFn: () => fetchRoadmap(),
  });

  // subjectIds 추출
  const subjectIds = roadmap?.subjects.map((s) => s.subjectId) ?? [];

  // 과목 상세 정보 병렬 요청
  const subjectDetailsResults = useQueries({
    queries: subjectIds.map((id) => ({
      queryKey: ['subjectDetail', id],
      queryFn: () => fetchSubjectDetail(id),
      enabled: !!id,
    })),
  });

  // 추천 콘텐츠 카드 구성
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

  // 피드백 병렬 요청 (subjectId 기반)
  const feedbackResults = useQueries({
    queries: subjectIds.map((id) => ({
      queryKey: ['userFeedback', id],
      queryFn: () => fetchUserFeedback(id),
      enabled: !!id,
    })),
  });

  // 평가 완료된 subjectName 목록 추출
  const evaluatedSubjectNames = subjectDetailsResults
    .filter((r): r is UseQueryResult<SubjectDetail, Error> & { data: SubjectDetail } =>
      r.status === 'success' && r.data.preSubmitCount > 0 && r.data.postSubmitCount > 0
    )
    .map((r) => r.data.subjectName);

  // 성공적으로 가져온 피드백 데이터만 추출
  const feedbackDataList = feedbackResults
    .filter((r): r is UseQueryResult<FeedbackItem[], Error> & { data: FeedbackItem[] } =>
      r.status === 'success' && !!r.data?.length
    )
    .flatMap((r) => r.data);

  // 리포트 카드 구성
  const reportCards = feedbackDataList
    .filter((fb) => evaluatedSubjectNames.includes(fb.info.subject))
    .map((fb) => ({
      title: `피드백 - ${fb.info.subject}`,
      detailUrl: `/report?subject=${fb.info.subject}&date=${fb.info.date}`,
      button1: '리포트 보러가기',
      subtitle: `제출일: ${fb.info.date}`,
    }));

  return (
    <div className="flex flex-col min-h-screen font-[pretendard]">
      <div className="flex-grow">
        <div className="w-full flex justify-between items-center mb-2 mt-8">
          <div className="flex">
            <img src={rabbit} alt="smallRabbit" className="w-[30px] mr-2" />
            <p className="text-[20px] font-bold">프론트엔드</p>
          </div>
        </div>

        <div className="w-full mb-13">
          <div className="mb-4 text-[20px] font-medium">
            {progressData?.nickname}님, 오늘도 학습을 진행해볼까요?
            <span className="ml-2 font-bold">{percent}%</span>
          </div>
          <div className="w-full max-w-md flex items-center gap-2 px-2">
            <div className="w-full h-6 border-2 border-[#59C5CD] px-[3px] py-[3px] box-border">
              <div className="h-full bg-[#C6EDF2]" style={{ width: `30px` }}></div>
            </div>
            <span className="text-[#59C5CD] text-sm font-medium whitespace-nowrap font-[NeoDunggeunmo]">
              20/30 완료
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
            onButton1Click={(card) => console.log(`리포트 보러가기: ${card.title}`)}
          />
        )}
      </div>

      {/* 푸터 */}
      <div className="mt-auto w-full py-4 text-center">
        <button onClick={logout} className="mr-2">로그아웃</button>
        <span className="mx-2">|</span>
        <button className="ml-2">회원탈퇴</button>
      </div>
    </div>
  );
}

export default MyPage;
