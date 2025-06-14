import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import BaseAdminPage from './BaseAdminPage';
import { fetchSubjectList, Subject } from '@/api/adminService';
import AdminPagination from './AdminPagination';
import AdminDataTable from './AdminDataTable';
import AdminDataFilter from './AdminDataFilter';

const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: 'subId',
    header: '과목 ID',
    cell: ({ row }) => <div>{row.getValue('subId')}</div>,
  },
  {
    accessorKey: 'subNm',
    header: '과목명',
    cell: ({ row }) => <div>{row.getValue('subNm')}</div>,
  },
  {
    accessorKey: 'subType',
    header: '과목 유형',
    cell: ({ row }) => <div>{row.getValue('subType')}</div>,
  },
  {
    accessorKey: 'subEssential',
    header: '필수 여부',
    cell: ({ row }) => <div>{row.getValue('subEssential') === 'Y' ? '필수' : '선택'}</div>,
  },
  {
    accessorKey: 'baseSubOrder',
    header: '순서',
    cell: ({ row }) => <div>{row.getValue('baseSubOrder')}</div>,
  },
  {
    accessorKey: 'trackId',
    header: '트랙 ID',
    cell: ({ row }) => <div>{row.getValue('trackId')}</div>,
  },
];

export default function SubjectListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = Number(searchParams.get('page')) || 1;

  const query = useQuery({
    queryKey: ['subjects', { ...searchParams }],
    queryFn: async () => {
      const data = await fetchSubjectList({
        pageSize: 10,
        pageIndex: pageIndex - 1,
        ...searchParams,
      });
      return {
        ...data,
        content: data.content.map((subject) => ({
          ...subject,
          id: subject.subId.toString(),
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

  const handleSubmit = (data: { subNm: string; subType: string }) => {
    setSearchParams((prev) => {
      data.subNm ? prev.set('subNm', data.subNm) : prev.delete('subNm');
      data.subType ? prev.set('subType', data.subType) : prev.delete('subType');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <BaseAdminPage title="과목 관리">
      <AdminDataFilter
        onSubmit={handleSubmit}
        items={[
          {
            name: 'subNm',
            label: '과목명',
          },
          {
            name: 'subType',
            label: '과목 유형',
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
