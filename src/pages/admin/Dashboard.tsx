import BaseAdminPage from './BaseAdminPage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import {
  fetchFeedbackDailyCounts,
  fetchRecommendDailyCounts,
  fetchUserList,
  fetchSubjectList,
  fetchExamList,
  fetchContentList,
} from '@/api/adminService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
};

function FailLogChart({
  feedback,
  recommend,
}: {
  feedback: { date: string; count: number }[];
  recommend: { date: string; count: number }[];
}) {
  const labels = Array.from(
    new Set([
      ...(feedback?.map((d) => d.date) ?? []),
      ...(recommend?.map((d) => d.date) ?? []),
    ]),
  ).sort();

  const data = {
    labels,
    datasets: [
      {
        label: '피드백',
        data: labels.map(
          (l) => feedback.find((d) => d.date === l)?.count ?? 0,
        ),
        borderColor: '#6378eb',
        backgroundColor: '#6378eb',
      },
      {
        label: '추천 컨텐츠',
        data: labels.map(
          (l) => recommend.find((d) => d.date === l)?.count ?? 0,
        ),
        borderColor: '#73ccd7',
        backgroundColor: '#73ccd7',
      },
    ],
  };

  return <Line className="w-full" options={options} data={data} />;
}

function DashboardLabelCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex flex-col gap-[10px] rounded-md border p-[20px]">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-2xl font-bold text-[#6378eb]">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: feedbackCounts } = useQuery({
    queryKey: ['dashboard-feedback-counts'],
    queryFn: fetchFeedbackDailyCounts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: recommendCounts } = useQuery({
    queryKey: ['dashboard-recommend-counts'],
    queryFn: fetchRecommendDailyCounts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: userData } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: () => fetchUserList({ page: 0, size: 1 }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: subjectData } = useQuery({
    queryKey: ['dashboard-subjects'],
    queryFn: () => fetchSubjectList({ page: 0, size: 1 }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: examData } = useQuery({
    queryKey: ['dashboard-exams'],
    queryFn: () => fetchExamList({ page: 0, size: 1 }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: contentData } = useQuery({
    queryKey: ['dashboard-contents'],
    queryFn: () => fetchContentList({ page: 0, size: 1 }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <BaseAdminPage title="대시보드">
      <div className="grid grid-cols-2 gap-[20px]">
        <DashboardLabelCard
          title="전체 사용자 수"
          value={userData?.totalElements ?? 0}
        />
        <DashboardLabelCard
          title="전체 과목 수"
          value={subjectData?.totalElements ?? 0}
        />
        <DashboardLabelCard
          title="전체 문제 수"
          value={examData?.totalElements ?? 0}
        />
        <DashboardLabelCard
          title="전체 추천 컨텐츠 수"
          value={contentData?.totalElements ?? 0}
        />
      </div>
      <div className="mt-[20px]">
        <h2 className="font-bold mb-2">실패 로그 일자별 합계</h2>
        <FailLogChart
          feedback={feedbackCounts ?? []}
          recommend={recommendCounts ?? []}
        />
      </div>
    </BaseAdminPage>
  );
}
