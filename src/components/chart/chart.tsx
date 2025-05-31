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
  labels: string[];
  values: number[];
  label?: string;
  color?: string;
}

export default function RadarChart({
  labels,
  values,
  label = 'score',
  color = 'rgba(91,124,255,1)',
}: Props) {
  const { data, options } = useMemo(() => {
    return {
      data: {
        labels,
        datasets: [
          {
            label,
            data: values,
            borderColor: color,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false, // ✅ 배경 제거
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top' as const,
            labels: {
              color: '#1f2937',
              font: { size: 14 },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `${context.label}: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 20,
              color: '#6b7280',
              backdropColor: 'transparent',
            },
            grid: {
              color: '#e5e7eb',
              circular: true,
            },
            pointLabels: {
              font: { size: 14 },
              color: '#374151',
            },
          },
        },
      },
    };
  }, [labels, values, label, color]);

  return (
    <div style={{ width: '100%', maxWidth: 500, height: 500, margin: 'auto' }}>
      <Radar data={data} options={options} />
    </div>
  );
}
