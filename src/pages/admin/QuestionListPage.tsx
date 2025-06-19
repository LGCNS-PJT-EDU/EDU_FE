import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import BaseAdminPage from './BaseAdminPage';
import { fetchExamList, Exam } from '@/api/adminService';
import AdminPagination from './AdminPagination';
import AdminDataTable from './AdminDataTable';
import AdminDataFilter from './AdminDataFilter';

type ExamRow = Omit<Exam, 'id'> & { id: string };

const columns: ColumnDef<ExamRow>[] = [
  {
    accessorKey: 'id',
    header: '문제 ID',
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'examContent',
    header: '문제 내용',
    cell: ({ row }) => <div>{row.getValue('examContent')}</div>,
  },
  {
    accessorKey: 'subName',
    header: '과목명',
    cell: ({ row }) => <div>{row.getValue('subName')}</div>,
  },
];

export default function ExamListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const examContent = searchParams.get('examContent') || '';
  const subName = searchParams.get('subName') || '';

  const query = useQuery({
    queryKey: ['admin-exams', { page, examContent, subName }],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const data = await fetchExamList({
        page: page - 1,
        size: 10,
        examContent,
        subName,
      });
      return {
        ...data,
        content: data.content.map((Exam) => ({
          ...Exam,
          id: Exam.id.toString(),
        })),
      };
    },
  });

  const table = useReactTable<ExamRow>({
    data: query.data?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  const handleSubmit = (data: { examContent: string; subName: string }) => {
    setSearchParams((prev) => {
      data.examContent ? prev.set('examContent', data.examContent) : prev.delete('examContent');
      data.subName ? prev.set('subName', data.subName) : prev.delete('subName');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams((prev) => {
      prev.delete('examContent');
      prev.delete('subName');
      prev.set('page', '1');
      return prev;
    });
  };
  
  return (
    <BaseAdminPage title="문제 관리">
      <AdminDataFilter
        onSubmit={handleSubmit}
        onReset={handleReset}
        items={[
          {
            name: 'examContent',
            label: '질문',
          },
          {
            name: 'subName',
            label: '과목명',
          },
        ]}
      />
      <AdminDataTable table={table} columns={columns} query={query} />
      <AdminPagination
        pageIndex={page}
        totalPages={query.data?.totalPages || 0}
        setPage={setPage}
      />
    </BaseAdminPage>
  );
}
