import BaseAdminPage from './BaseAdminPage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels = ['6/8(일)', '6/9(월)', '6/10(화)', '6/11(수)', '6/12(목)', '6/13(금)', '6/14(토)'];

export const data = {
  labels,
  datasets: [
    {
      label: '사용자 수',
      data: labels.map(() => Math.random() * 10),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

function UserChart() {
  return <Line className="w-full" options={options} data={data} />;
}

function DashboardLabelCard({ title, value }: { title: string; value: number }) {
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
        <DashboardLabelCard title="전체 사용자 수" value={100} />
        <DashboardLabelCard title="전체 문항 수" value={100} />
        <DashboardLabelCard title="전체 문제 수" value={100} />
        <DashboardLabelCard title="전체 문제 수" value={100} />
      </div>
      <div className="mt-[20px]">
        <UserChart />
      </div>
    </BaseAdminPage>
  );
}
