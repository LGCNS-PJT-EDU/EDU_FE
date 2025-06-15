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
import 'chart.js/auto';

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
    const filledColor = color.replace('1)', '0.3)');
    const textColor = color.replace('1)', '1)'); 

    return {
      data: {
        labels,
        datasets: [
          {
            label,
            data: values,
            borderColor: color,
            borderWidth: 2,
            fill: true,
            backgroundColor: filledColor,
            pointBackgroundColor: filledColor,
            pointRadius: 0,
            pointHoverRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 40,
            right: 30,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'center',
            labels: {
              color: textColor,
              font: { size: 14 },
              boxWidth: 20,
              padding: 20,
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
            max: 20,
            ticks: {
              stepSize: 5,
              color: '#6b7280',
              backdropColor: 'transparent',
            },
            grid: {
              color: '#e5e7eb',
              circular: false,
            },
            pointLabels: {
              font: { size: 14, weight: 'bold' },
              color: textColor,
              padding: 5,
              callback: function (label: string, index: number) {
                const score = values[index];
                const breakSymbols = ['&', '·'];

                let breakIndex = -1;

                // 모든 기호 위치 수집
                const symbolIndexes = [];
                for (const symbol of breakSymbols) {
                  let i = label.indexOf(symbol);
                  while (i !== -1) {
                    symbolIndexes.push(i);
                    i = label.indexOf(symbol, i + 1);
                  }
                }

                // 두 번째 기호가 있다면 해당 위치 기준으로 줄바꿈
                if (symbolIndexes.length >= 2) {
                  const sorted = symbolIndexes.sort((a, b) => a - b);
                  breakIndex = sorted[1];
                }

                if (breakIndex !== -1) {
                  const line1 = label.slice(0, breakIndex + 1).trim(); // 기호 포함
                  const line2 = label.slice(breakIndex + 1).trim(); // 나머지
                  return [line1, line2, `${score}점`];
                }

                return [label, `${score}점`];
              },
            },
          },
        },
      },
    };
  }, [labels, values, label, color]);

  return (
    <div className="w-full max-w-[800px] h-[490px] mx-auto flex justify-center items-center">
      <Radar data={data} options={options as any} />
    </div>
  );
}
