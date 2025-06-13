// components/ui/SpeechCard.tsx
import { InterviewItem } from '@/hooks/useInterviewHistory';
import { useNavigate } from 'react-router-dom';

interface Props {
  item: InterviewItem;
}

export default function SpeechCard({ item }: Props) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-300 border-l-4 border-l-[#5b7cff] rounded-lg shadow hover:shadow-lg p-4 flex flex-col">
      <div className="text-[#5b7cff] font-bold text-base mb-1">
        {item.nth}번째 리포트
      </div>
      <div className="text-sm text-gray-700 mb-2 flex-1">
        진단 결과를 확인해보세요.
      </div>
      <button
        onClick={() => navigate(`/speechfeedback?nth=${item.nth}`)}
        className="mt-auto px-3 py-1 text-sm bg-[#5b7cff] text-white rounded hover:bg-[#3e5bd2] transition-colors"
      >
        리포트 보기
      </button>
    </div>
  );
}
