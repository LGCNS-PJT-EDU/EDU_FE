import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// ✅ 반드시 ChartJS.register로 요소 등록
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ✅ 컴포넌트 바깥에서 정의
const data = {
  labels: ['HTML', 'CSS', 'React', 'Python', 'SCSS'],
  datasets: [
    {
      label: '2020',
      data: [65, 59, 90, 81, 56],
      backgroundColor: 'rgba(91, 124, 255, 0.2)',
      borderColor: 'rgba(91, 124, 255, 1)',
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        color: '#6b7280',
      },
      grid: {
        color: '#d1d5db',
      },
      pointLabels: {
        font: { size: 14 },
        color: '#374151',
      },
    },
  },
};

// ✅ 정상 export
export default function RadarChart() {
  return <Radar data={data} options={options} />;
}
