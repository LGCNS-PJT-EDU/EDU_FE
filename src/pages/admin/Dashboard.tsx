import BaseAdminPage from './BaseAdminPage';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: '사용자 통계',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => Math.random() * 1000),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => Math.random() * 1000),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

function UserChart() {
  return <Line className="w-full" options={options} data={data} />;
}

function DashboardCard({ title, value }: { title: string, value: number }) {
  return (
    <div className="flex flex-col gap-[10px] rounded-md border p-[20px]">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <BaseAdminPage title="대시보드">
      <div className="grid grid-cols-2 gap-[20px]">
          <DashboardCard title="사용자 통계" value={100} />
          <DashboardCard title="사용자 통계" value={100} />
          <DashboardCard title="사용자 통계" value={100} />
          <DashboardCard title="사용자 통계" value={100} />
      </div>
      <div className="mt-[20px]">
        <UserChart />
      </div>
    </BaseAdminPage>
  );
}
