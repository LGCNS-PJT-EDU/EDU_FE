import { useSubjectDetail } from '@/hooks/useSubjectDetail';
import { useRoadmapStore } from '@/store/roadmapStore';
import { useNavigate } from 'react-router-dom';
import RecommendationCard from '@/components/ui/RecommendationCard';

export interface SubjectRef {
  subjectId: number;
  subjectName: string;
}

interface SubjectModalProps {
  subject: {
    subjectId: number;
    subjectName: string;
  };
  onClose: () => void;
}

export default function SubjectModal({ subject, onClose }: SubjectModalProps) {
  const navigate = useNavigate();
  const { subjectId } = subject;

  /* 과목의 status 계산하기 */
  const nodes = useRoadmapStore((s) => s.nodes);
  const rawCurrentOrder = useRoadmapStore((s) => s.currentOrder) ?? 0;
  const nodeData = nodes.find((n) => n.id === subjectId);
  const nodeOrder = nodeData?.subjectOrder ?? Infinity;
  const status =
    nodeOrder < rawCurrentOrder ? 'done' : nodeOrder === rawCurrentOrder ? 'current' : 'todo';

  const { data: detail, isLoading, isError } = useSubjectDetail(subjectId);

  const goPreTest = () => {
    navigate(`/pretest?subjectId=${subjectId}`);
    onClose();
  };

  const goPostTest = () => {
    navigate(`/posttest?subjectId=${subjectId}`);
    onClose();
  };

  const goReport = () => {
    navigate(`/report?subjectId=${subjectId}`);
    onClose();
  };

  const goSolution = () => {
    navigate(`/solution?subjectId=${subjectId}`);
    onClose();
  };

  const overview = detail?.overview || '';
  const [firstPart, ...restParts] = overview.split(/(?<=[?])\s*/); // "?" 포함 분리
  const remainingOverview = restParts.join(' ');

  return (
    <div className="fixed inset-0 z-[1000] font-[Pretendard]">
      <div className="w-full h-full bg-black/50 flex items-center justify-center">
        <div className="relative w-[90%] max-w-[540px] bg-white rounded-2xl p-8 shadow-[0_12px_24px_rgba(0,0,0,0.2)] flex flex-col max-h-[80vh]">
          {/* 닫기 버튼 */}
          <button
            className="absolute top-4 right-5 text-[28px] text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>

          {/* 제목 */}
          <h3 className="text-[22px] font-bold mb-4">{subject.subjectName}</h3>

          {/* 로딩 / 에러 / 본문 */}
          {isLoading ? (
            <p className="text-gray-700">로딩 중...</p>
          ) : isError || !detail ? (
            <p className="text-gray-700">과목 정보를 불러오는 데 실패했습니다.</p>
          ) : (
            <div className="border border-slate-300 rounded-md p-2 mb-4 whitespace-pre-line custom-scroll transition-all duration-300 ease-in-out overflow-y-auto max-h-[400px]">
              <p className="leading-relaxed mb-2">{firstPart}</p>
              <p className="leading-relaxed mb-5">{remainingOverview}</p>

              <h4 className="font-semibold mb-2">챕터</h4>
              <ol className="mb-5 list-decimal pl-5">
                {detail.chapters
                  .sort((a, b) => a.chapterOrder - b.chapterOrder)
                  .map((chapter) => (
                    <li key={chapter.chapterOrder}>{chapter.chapterName}</li>
                  ))}
              </ol>

              <h4 className="font-semibold mb-2">추천 콘텐츠</h4>
              {(detail.recommendContents ?? []).length > 0 ? (
                detail.recommendContents!.map((item) => (
                  <RecommendationCard
                    key={item.contentId}
                    title={item.title}
                    url={item.url}
                    type={item.type}
                    platform={item.platform}
                    isAiRecommendation={item.isAiRecommendation}
                    comment={item.comment}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">사전평가 완료 후 추천 콘텐츠가 제공됩니다.</p>
              )}
            </div>
          )}

          {/* 버튼 */}
          {isLoading ? (
            <p>로딩 중...</p>
          ) : isError || !detail ? (
            <p>불러오기 실패</p>
          ) : (
            <>
              {status === 'todo' ? (
                <button
                  className="w-full border border-gray-300 text-gray-600 bg-gray-100 py-2 px-4 rounded-lg"
                  onClick={onClose}
                >
                  이전 과목을 먼저 이수해주세요!
                </button>
              ) : detail.preSubmitCount < 1 ? (
                <button
                  className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#D8F2F3] py-2 px-4 rounded-lg"
                  onClick={goPreTest}
                >
                  사전평가 보러가기
                </button>
              ) : (
                <>
                  <button
                    className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#D8F2F3] py-2 px-4 rounded-lg mb-2"
                    onClick={goPostTest}
                  >
                    사후평가 보러가기
                  </button>
                  <button
                    className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#D8F2F3] py-2 px-4 rounded-lg mb-2"
                    onClick={goReport}
                  >
                    평가 리포트 보러가기
                  </button>
                  <button
                    className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#D8F2F3] py-2 px-4 rounded-lg mb-2"
                    onClick={goSolution}
                  >
                    오답 보러가기
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
