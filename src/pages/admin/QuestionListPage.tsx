import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import BaseAdminPage from './BaseAdminPage';
import { fetchQuestionList, Question } from '@/api/adminService';
import AdminPagination from './AdminPagination';
import AdminDataTable from './AdminDataTable';
import AdminDataFilter from './AdminDataFilter';

interface QuestionWithId extends Question {
  id: string;
}

const columns: ColumnDef<QuestionWithId>[] = [
  {
    accessorKey: 'questionId',
    header: '질문 ID',
    cell: ({ row }) => <div>{row.getValue('questionId')}</div>,
  },
  {
    accessorKey: 'question',
    header: '질문',
    cell: ({ row }) => <div>{row.getValue('question')}</div>,
  },
  {
    accessorKey: 'questionType',
    header: '질문 유형',
    cell: ({ row }) => <div>{row.getValue('questionType')}</div>,
  },
];

export default function QuestionListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = Number(searchParams.get('page')) || 1;

  const query = useQuery({
    queryKey: ['questions', { ...searchParams }],
    queryFn: async () => {
      const data = await fetchQuestionList({
        pageSize: 10,
        pageIndex: pageIndex - 1,
        ...searchParams,
      });
      return {
        ...data,
        content: data.content.map((question) => ({
          ...question,
          id: question.questionId.toString(),
        })),
      };
    },
  });

  const table = useReactTable({
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

  const handleSubmit = (data: { question: string; questionType: string }) => {
    setSearchParams((prev) => {
      data.question ? prev.set('question', data.question) : prev.delete('question');
      data.questionType ? prev.set('questionType', data.questionType) : prev.delete('questionType');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams((prev) => {
      prev.delete('question');
      prev.delete('questionType');
      prev.set('page', '1');
      return prev;
    });
  };
  
  return (
    <BaseAdminPage title="질문 관리">
      <AdminDataFilter
        onSubmit={handleSubmit}
        onReset={handleReset}
        items={[
          {
            name: 'question',
            label: '질문',
          },
          {
            name: 'questionType',
            label: '질문 유형',
          },
        ]}
      />
      <AdminDataTable table={table} columns={columns} query={query} />
      <AdminPagination
        pageIndex={pageIndex}
        totalPages={query.data?.totalPages || 0}
        setPage={setPage}
      />
    </BaseAdminPage>
  );
}
