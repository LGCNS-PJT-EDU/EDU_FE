import { useRef, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const data = {
  labels: ['React', 'HTML', 'CSS', 'JavaScript', 'Python'],
  datasets: [
    {
      label: '평가 점수',
      data: [5, 4.5, 4, 5, 4.5],
      backgroundColor: 'rgba(48, 127, 226, 0.2)',
      borderColor: '#307fe2',
      pointBackgroundColor: '#307fe2',
      pointBorderColor: '#fff',
    },
  ],
};

const options = {
  scales: {
    r: {
      beginAtZero: true,
      min: 0,
      max: 5,
      ticks: {
        stepSize: 1,
        backdropColor: 'transparent',
        color: '#666',
      },
      pointLabels: {
        font: {
          size: 14,
        },
        color: '#000',
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

function RadarChart() {
  const chartRef = useRef(null);

  // 차트가 unmount될 때 destroy() 호출
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy?.();
      }
    };
  }, []);

  return (
    <div style={{ width: '300px', margin: '0 auto' }}>
      <Radar ref={chartRef} data={data} options={options} />
    </div>
  );
}

export default RadarChart;
