import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';
import useLogout from '@/hooks/useLogout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import CardGrid from '@/components/ui/CardGrid';
import rabbit from '@/asset/img/diagnosis/smallRabbit.png';

import { fetchRoadmap } from '@/api/roadmapService';
import { fetchSubjectDetail, SubjectDetail } from '@/hooks/useSubjectDetail';

function MyPage() {
  const navigate = useNavigate();
  const logout = useLogout();
  const [activeTab, setActiveTab] = useState<'favorite' | 'report'>('favorite');
  const { data: progressData } = useProgress();
  const percent = Math.min(100, Math.round(progressData?.percent || 0));

  // 로드맵 데이터 조회
  const { data: roadmap } = useQuery({
    queryKey: ['myRoadmap'],
    queryFn: () => fetchRoadmap(),
  });

  // subjectIds 추출
  const subjectIds = roadmap?.subjects.map((s) => s.subjectId) ?? [];

  // 과목 상세 정보 병렬 호출 (추천 콘텐츠 포함)
  const subjectDetailsResults = useQueries({
    queries: subjectIds.map((id) => ({
      queryKey: ['subjectDetail', id],
      queryFn: () => fetchSubjectDetail(id),
      enabled: !!id,
    })),
  });

  // 추천 콘텐츠 card 변환
const cardList = subjectDetailsResults
  .filter((r): r is UseQueryResult<SubjectDetail, Error> & { data: SubjectDetail } =>
    r.status === 'success' &&
    !!r.data?.recommendContents?.length &&
    r.data.preSubmitCount > 0  //사전평가 했는지 확인
  )
  .flatMap((r) =>
    r.data.recommendContents!.map((content) => ({
      title: content.title,
      detailUrl: content.url,
      button1: '바로가기',
      button2: content.platform,
    }))
  );

  // 사전사후평가 보면 평가리포트 생성
  const reportCards = subjectDetailsResults
    .filter((r): r is UseQueryResult<SubjectDetail, Error> & { data: SubjectDetail } => 
      r.status === 'success' && r.data.preSubmitCount > 0
    )
    .map((r) => ({
    title: r.data.subjectName, // 실제 과목 이름
    subjectId: r.data.subjectId,
    detailUrl: `/solution?subjectId=${r.data.subjectId}`,
    button1: '리포트 보러가기',
    button2: '면접 리포트 보러가기',
    }))

  return (
    <div className="flex flex-col min-h-screen font-[pretendard]">
      <div className="flex-grow">
        <div className="w-full flex justify-between items-center mb-2 mt-8">
          <div className="flex">
            <img src={rabbit} alt="smallRabbit" className="w-[30px] mr-2" />
            <p className="text-[20px] font-bold">프론트엔드</p> {/* roadmapName 넣어주기 */}
          </div>
        </div>

        <div className="w-full mb-13">
          <div className="mb-4 text-[20px] font-medium">
            {progressData?.nickname}님, 오늘도 학습을 진행해볼까요?
            <span className="ml-2 font-bold">{percent}%</span>
          </div>
          <div className="w-[60%] flex items-center gap-2">
            <div className="w-full h-6 border-2 border-[#59C5CD] px-[3px] py-[3px] box-border">
              <div className="h-full bg-[#C6EDF2]" style={{ width: `30px` }}></div>
            </div>
            <span className="text-[#59C5CD] text-sm font-medium whitespace-nowrap font-[NeoDunggeunmo]">
              20/30 완료
            </span>
          </div>
        </div>

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

        {/* 탭 콘텐츠 */}
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

      {/* 회원탈퇴, 로그아웃 */}
      <div className="mt-auto w-full py-4 text-center">
        <button onClick={logout} className="mr-2">로그아웃</button>
        <span className="mx-2">|</span>
        <button className="ml-2">회원탈퇴</button>
      </div>
    </div>
  );
}

export default MyPage;
