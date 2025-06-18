import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import BaseAdminPage from './BaseAdminPage';
import {
  fetchRecommendFailLogs,
  RecommendFailLog,
  retryRecommendFailLog,
} from '@/api/adminService';
import AdminPagination from './AdminPagination';
import AdminDataTable from './AdminDataTable';
import AdminDataFilter from './AdminDataFilter';
import { Button } from '@/components/ui/button';

export default function RecommendFailLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get('page')) || 1;
  const nickname = searchParams.get('nickname') || '';
  const email = searchParams.get('email') || '';
  const errorCode = searchParams.get('errorCode') || '';

  const retryMutation = useMutation({
    mutationFn: (id: number) => retryRecommendFailLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey[0] === 'admin-recommend-fail-logs' ||
          q.queryKey[0] === 'admin-recommend-fail-logs-without-filter',
      });
    },
  });

  const query = useQuery({
    queryKey:
      nickname || email || errorCode
        ? ['admin-recommend-fail-logs', { page, nickname, email, errorCode }]
        : ['admin-recommend-fail-logs-without-filter'],
    queryFn: async () => {
      const data = await fetchRecommendFailLogs({
        page: page - 1,
        size: 10,
        nickname,
        email,
        errorCode,
        sort: 'id,desc',
      });
      return data;
    },
  });

  const columns: ColumnDef<RecommendFailLog>[] = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', cell: ({ row }) => <div>{row.getValue('id')}</div> },
      { accessorKey: 'email', header: '이메일', cell: ({ row }) => <div>{row.getValue('email')}</div> },
      { accessorKey: 'nickname', header: '닉네임', cell: ({ row }) => <div>{row.getValue('nickname')}</div> },
      { accessorKey: 'subjectId', header: '과목 ID', cell: ({ row }) => <div>{row.getValue('subjectId')}</div> },
      { accessorKey: 'errorCode', header: '오류 코드', cell: ({ row }) => <div>{row.getValue('errorCode')}</div> },
      { accessorKey: 'errorMessage', header: '오류 메시지', cell: ({ row }) => <div>{row.getValue('errorMessage')}</div> },
      { accessorKey: 'retry', header: '재시도 여부', cell: ({ row }) => <div>{row.getValue('retry') ? 'Y' : 'N'}</div> },
      {
        accessorKey: 'createdDt',
        header: '생성일',
        cell: ({ row }) => <div>{(row.getValue('createdDt') as string).split('.')[0]}</div>,
      },
      {
        id: 'actions',
        header: '재시도',
        cell: ({ row }) => (
          <Button
            disabled={retryMutation.isPending}
            onClick={() => retryMutation.mutate(row.original.id)}
          >
            재시도
          </Button>
        ),
      },
    ],
    [retryMutation]
  );

  const table = useReactTable({
    data: query.data?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const setPage = (p: number) => {
    setSearchParams((prev) => {
      prev.set('page', p.toString());
      return prev;
    });
  };

  const handleSubmit = (data: { nickname: string; email: string; errorCode: string }) => {
    setSearchParams((prev) => {
      data.nickname ? prev.set('nickname', data.nickname) : prev.delete('nickname');
      data.email ? prev.set('email', data.email) : prev.delete('email');
      data.errorCode ? prev.set('errorCode', data.errorCode) : prev.delete('errorCode');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams((prev) => {
      prev.delete('nickname');
      prev.delete('email');
      prev.delete('errorCode');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <BaseAdminPage title="추천 컨텐츠 실패 로그">
      <AdminDataFilter
        onSubmit={handleSubmit}
        onReset={handleReset}
        items={[
          { name: 'nickname', label: '닉네임' },
          { name: 'email', label: '이메일' },
          { name: 'errorCode', label: '오류코드' },
        ]}
      />
      <AdminDataTable table={table} columns={columns} query={query} />
      <AdminPagination pageIndex={page} totalPages={query.data?.totalPages || 0} setPage={setPage} />
    </BaseAdminPage>
  );
}
