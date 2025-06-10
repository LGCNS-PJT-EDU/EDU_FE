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
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: false,
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
            max: 75,
            ticks: {
              stepSize: 15,
              color: '#6b7280',
              backdropColor: 'transparent',
            },
            grid: {
              color: '#e5e7eb',
              circular: false,
            },
            pointLabels: {
              font: 
              { size: 14,
                weight: 'bold'
               },
              color: '#6378EB',
              callback: function(label: string, index: number){
                const score = values[index];
                return [label, `${score}점`]
              }
            },
          },
        },
      },
    };
  }, [labels, values, label, color]);

  return (
    <div style={{ width: '100%', maxWidth: 600, height: 600, margin: 'auto' }}>
      <Radar data={data} options={options as any} />
    </div>
  );
}
