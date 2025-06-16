import { useEffect, useState } from 'react';
import { useSubjectDetail } from '@/hooks/useSubjectDetail';
import { useRoadmapStore } from '@/store/roadmapStore';
import { useNavigate } from 'react-router-dom';
import RecommendationCard from '@/components/ui/RecommendationCard';

import { ChevronDown, ChevronUp } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { subjectId } = subject;
  const [showChapters, setShowChapters] = useState(false);

  const nodes = useRoadmapStore((s) => s.nodes);
  const rawCurrentOrder = useRoadmapStore((s) => s.currentOrder) ?? 0;
  const nodeData = nodes.find((n) => n.id === subjectId);
  const nodeOrder = nodeData?.subjectOrder ?? Infinity;
  const status = nodeOrder < rawCurrentOrder ? 'done' : nodeOrder === rawCurrentOrder ? 'current' : 'todo';


  const { data: detail, isLoading, isError } = useSubjectDetail(subjectId);

  const goPreTest = () => { navigate(`/pretest?subjectId=${subjectId}`); onClose(); };
  const goPostTest = () => { navigate(`/posttest?subjectId=${subjectId}`); onClose(); };
  const goReport = () => { navigate(`/report?subjectId=${subjectId}`); onClose(); };
  const goSolution = () => { navigate(`/solution?subjectId=${subjectId}`); onClose(); };

  const overview = detail?.overview || '';
  const formattedOverview = overview.replace(/([.!?])(?=\S)/g, '$1 ');
  const [firstPart, ...restParts] = formattedOverview.split(/(?<=[?])\s*/);
  const remainingOverview = restParts.join(' ');

  const content = (
    <div className="flex flex-col flex-grow overflow-y-auto custom-scroll pr-1">
      {isLoading ? (
        <p className="text-gray-700">로딩 중...</p>
      ) : isError || !detail ? (
        <p className="text-gray-700">과목 정보를 불러오는 데 실패했습니다.</p>
      ) : (
        <>
          <h4
            className="font-semibold mb-2 cursor-pointer select-none flex items-center gap-1"
            onClick={() => setShowChapters((prev) => !prev)}
          >
            <span>📂</span>
            <span>챕터</span>
            <span className="text-sm text-[#505050] mr-3">
              {showChapters ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </span>
          </h4>
          <ol className={`mb-5 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${showChapters ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {detail.chapters
              .sort((a, b) => a.chapterOrder - b.chapterOrder)
              .map((chapter) => (
                <li
                  key={chapter.chapterOrder}
                  className="bg-[#f8fafa] border border-[#e6f1f3] rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-[#e7f4f6] hover:text-[#219eab] cursor-pointer transition-colors duration-200"
                >
                  {chapter.chapterOrder}. {chapter.chapterName}
                </li>
              ))}
          </ol>

          <h4 className="font-semibold mb-2">❓ {firstPart}</h4>
          <p className="leading-relaxed mb-2 bg-[#f9fafa] p-4 rounded-md border-l-4 border-[#b1dfe5] text-sm text-gray-700">{remainingOverview}</p>

          <h4 className="font-semibold mb-2">🎯 추천 콘텐츠</h4>
          {Array.isArray(detail.recommendContents) && detail.recommendContents.length > 0 ? (
            detail.recommendContents.map((item) => <RecommendationCard key={item.contentId} {...item} />)
          ) : (
            <p className="text-sm text-gray-500">사전평가 완료 후 추천 콘텐츠가 제공됩니다.</p>
          )}
        </>
      )}
    </div>
  );

  const ButtonGroup = (
    <div className={`pt-4 space-y-2 pb-6 bg-white border-t ${isMobile ? '' : 'px-6'}`}>
      {status === 'todo' ? (
        <button className="w-full border border-gray-300 text-gray-600 bg-gray-100 py-2 px-4 rounded-lg" onClick={onClose}>
          이전 과목을 먼저 이수해주세요!
        </button>
      ) : detail?.preSubmitCount != null && detail.preSubmitCount < 1 ? (
        <button className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#D8F2F3] py-2 px-4 rounded-lg" onClick={goPreTest}>
          사전평가 보러가기
        </button>
      ) : (
        <>
          <button className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#d0eef1] hover:bg-[#92d6de] hover:text-white py-2 px-4 rounded-lg" onClick={goPostTest}>
            사후평가 보러가기
          </button>
          <button className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#d0eef1] hover:bg-[#92d6de] hover:text-white py-2 px-4 rounded-lg" onClick={goReport}>
            평가 리포트 보러가기
          </button>
          <button className="w-full border border-[#34ABB9] text-[#34ABB9] bg-[#d0eef1] hover:bg-[#92d6de] hover:text-white py-2 px-4 rounded-lg" onClick={goSolution}>
            오답 보러가기
          </button>
        </>
      )}
    </div>
  );

  return isMobile ? (
    <div className="fixed inset-0 z-[1000] font-[Pretendard]">
      <div className="w-full h-full bg-black/50 flex items-center justify-center">
        <div className="relative w-[90%] max-w-[540px] bg-white rounded-2xl shadow-lg flex flex-col max-h-[80vh] p-6">
          <button className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
          <h3 className="text-xl font-bold mb-4">{subject.subjectName}</h3>
          {content}
          {!isLoading && !isError && detail && ButtonGroup}
        </div>
      </div>
    </div>
  ) : (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[600px] max-w-full font-[Pretendard] flex flex-col h-screen">
        {/* 헤더 */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>{subject.subjectName}</span>
          </h2>
          <button onClick={onClose} className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition text-[22px] border-none outline-none bg-transparent p-0">
            &times;
          </button>
        </div>

        {/* 스크롤 콘텐츠 */}
        <div className="flex-grow overflow-y-auto custom-scroll px-6">
          {content}
        </div>

        {/* 하단 고정 버튼 */}
        {!isLoading && !isError && detail && ButtonGroup}
      </SheetContent>
    </Sheet>
  );
}
