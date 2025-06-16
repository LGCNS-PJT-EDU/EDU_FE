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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

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
          padding: isMobile
            ? { top: 0, bottom: 0, left: 10, right: 20 }
            : { top: 10, bottom: 30, left: 15, right: 15 },
        },
        plugins: {
          legend: {
            display: !isMobile,
            position: 'top',
            align: 'center',
            labels: {
              color: textColor,
              font: { size: 14 },
              boxWidth: 20,
              padding: 10,
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

                const isMobile = window.innerWidth < 480;

                const symbolIndexes = [];
                for (const symbol of breakSymbols) {
                  let i = label.indexOf(symbol);
                  while (i !== -1) {
                    symbolIndexes.push(i);
                    i = label.indexOf(symbol, i + 1);
                  }
                }

                if (symbolIndexes.length >= 2) {
                  const sorted = symbolIndexes.sort((a, b) => a - b);
                  breakIndex = sorted[1];
                }

                if (isMobile && label.length > 10 && breakIndex === -1) {
                  breakIndex = Math.floor(label.length / 2);
                }

                if (breakIndex !== -1) {
                  const line1 = label.slice(0, breakIndex + 1).trim();
                  const line2 = label.slice(breakIndex + 1).trim();
                  return [line1, line2, `${score}점`];
                }

                return [label, `${score}점`];
              },
            },
          },
        },
      },
    };
  }, [labels, values, label, color, isMobile]);

  return (
    <div className="w-full max-w-[800px] h-[60vh] sm:h-[480px] mx-auto flex justify-center items-center">
      <Radar data={data} options={options as any} />
    </div>
  );
}
