import { useState } from 'react';
import { useSubjectDetail } from '@/hooks/useSubjectDetail';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export interface SubjectRef {
  subjectId: number;
  subjectName: string;
}

interface SubjectModalProps {
  subject: {
    subjectId: number;
    subjectName: string;
  }
  onClose: () => void;
}

export default function SubjectModal({ subject, onClose }: SubjectModalProps) {
  const navigate = useNavigate();
  const { subjectId } = subject;
  const [isOpen, setIsOpen] = useState(false);

  const { data: detail, isLoading, isError } = useSubjectDetail(subject.subjectId);

  const goPreTest = () => {
    navigate(`/pretest?subjectId=${subjectId}`);
    onClose();
  };

  const goPostTest = () => {
    navigate(`/posttest?subjectId=${subjectId}`);
    onClose();
  };

  const toggleContent = () => setIsOpen(!isOpen);

  /* overview 문장 분리  */
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
            <div className="border border-slate-300 rounded-md p-2 mb-4 whitespace-pre-line custom-scroll transition-all duration-300 ease-in-out overflow-hidden max-h-[300px] overflow-y-auto">
              <p className="leading-relaxed mb-5">
                {firstPart}
                {' '}
                <button
                  onClick={toggleContent}
                  className="inline-flex items-center text-black-600 ml-2"
                >
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </p>

              {isOpen && (
                <>
                  {remainingOverview && (
                    <p className="leading-relaxed mb-5">{remainingOverview}</p>
                  )}

                  <h4 className="font-semibold mb-2">챕터</h4>
                  <ol className="mb-5 list-decimal pl-5">
                    {detail.chapters
                      .sort((a, b) => a.chapterOrder - b.chapterOrder)
                      .map((chapter) => (
                        <li key={chapter.chapterOrder}>{chapter.chapterName}</li>
                      ))}
                  </ol>

                  <h4 className="font-semibold mb-2">추천 강의</h4>
                  <ul className="list-disc pl-5 mb-4">
                    {detail.videos.map((video) => (
                      <li key={video.title}>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 underline"
                        >
                          {video.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex flex-col gap-2">
            <button
              className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#D8F2F3] py-2 px-4 rounded-lg"
              onClick={goPreTest}
            >
              사전평가 보러가기
            </button>
            <button
              className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#D8F2F3] py-2 px-4 rounded-lg"
              onClick={goPostTest}
            >
              사후평가 보러가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
