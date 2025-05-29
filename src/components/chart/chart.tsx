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
import { useMemo } from 'react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  labels: string[];      // 과목 5개
  values: number[];      // 점수 5개
  label?: string;        // 범례(Pre, Post 등)
  color?: string;        // 선 색
}

export default function RadarChart({
  labels,
  values,
  label = 'score',
  color = 'rgba(91,124,255,1)',
}: Props) {
  const { data, options } = useMemo(() => {
    const bg  = color.replace(/rgb(a?)\((.+)\)/, 'rgba($2,0.15)');
    return {
      data: {
        labels,
        datasets: [
          { label, data: values, backgroundColor: bg, borderColor: color, borderWidth: 1 },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20 },
            grid: { color: '#d1d5db' },
            pointLabels: { font: { size: 14 }, color: '#374151' },
          },
        },
      },
    };
  }, [labels, values, label, color]);

  return <Radar data={data} options={options} />;
}
