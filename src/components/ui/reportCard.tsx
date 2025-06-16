import { useNavigate } from 'react-router-dom';

interface ReportCardProps {
  title: string;
  subtitle?: string;
  detailUrl: string;
  buttonLabel?: string;
}

export default function ReportCard({
  title,
  subtitle,
  detailUrl,
  buttonLabel = '리포트 보기',
}: ReportCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-300 border-l-4 border-l-[#DDE6FB] rounded-lg shadow hover:shadow-lg p-4 flex flex-col h-full">
      <div className="text-[#6378EB] font-bold text-base mb-1">{title}</div>
      <div className="text-sm text-gray-700 mb-2 flex-1">
        {subtitle ?? '진단 결과를 확인해보세요.'}
      </div>
      <button
        onClick={() => navigate(detailUrl)}
        className="mt-auto px-3 py-2 text-sm bg-[#779AF4] text-white rounded hover:bg-[#3e5bd2] transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  );
}