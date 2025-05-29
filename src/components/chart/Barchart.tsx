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
  labels: string[];   // 5과목
  pre: number[];      // 사전 점수
  post: number[];     // 사후 점수
  final?: string;     // 종합 코멘트
}

export default function BarChart({ labels, pre, post, final }: Props) {
  const data = {
    labels,
    datasets: [
      { label: 'Pre',  data: pre,  backgroundColor: 'rgba(91,124,255,0.6)' },
      { label: 'Post', data: post, backgroundColor: 'rgba(255,106,176,0.6)' },
    ],
  };
  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' as const } },
    scales: { y: { min: 0, max: 100, ticks: { stepSize: 20 } } },
  };

  return (
    <div className="space-y-4">
      <Bar data={data} options={options} />
      {final && (
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 shadow">
          <strong>종합 평가&nbsp;:</strong> {final}
        </div>
      )}
    </div>
  );
}
