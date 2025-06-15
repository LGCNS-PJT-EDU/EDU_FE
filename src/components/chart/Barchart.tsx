import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  pre: number;
  post: number;
  final?: string;
}

export default function BarChart({ pre, post, final }: Props) {
  const data = {
    labels: ['사전평가', '사후평가'],
    datasets: [
      {
        label: '점수',
        data: [pre, post],
        backgroundColor: ['rgba(91, 124, 255, 0.4)', 'rgba(255, 106, 176, 0.4)'],
        borderColor: ['rgba(91, 124, 255, 0.8)', 'rgba(255, 106, 176, 0.8)'],
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 100,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20 },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          display: false,
          categoryPercentage: 0.3,
        },
      },
    },
  };

  return (
    <div className="space-y-4 mt-15">
      <Bar data={data} options={options} />
      {final && (
        <div className="w-full mx-auto rounded-lg bg-[#EEF3FF] p-5 text-base text-gray-800 shadow-sm">
          <p className="text-center">
            <strong className="text-[#6378EB] font-semibold">종합 평가:</strong> {final}
          </p>
        </div>
      )}
        <p className="text-xs text-gray-400 my-4">
    ※ 본 결과는 AI 기반 진단 분석에 따라 제공됩니다.
  </p>
    </div>
  );
}
