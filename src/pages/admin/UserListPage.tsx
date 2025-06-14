import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import BaseAdminPage from './BaseAdminPage';
import { fetchUserList, User } from '@/api/adminService';
import AdminPagination from './AdminPagination';
import AdminDataTable from './AdminDataTable';
import AdminDataFilter from './AdminDataFilter';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'userId',
    header: '아이디',
    cell: ({ row }) => <div>{row.getValue('userId')}</div>,
  },
  {
    accessorKey: 'email',
    header: '이메일',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'nickname',
    header: '닉네임',
    cell: ({ row }) => <div>{row.getValue('nickname')}</div>,
  },
  {
    accessorKey: 'loginType',
    header: '로그인 타입',
    cell: ({ row }) => <div>{row.getValue('loginType')}</div>,
  },
  {
    accessorKey: 'lectureAmount',
    header: '강의 수',
    cell: ({ row }) => <div>{row.getValue('lectureAmount')}</div>,
  },
  {
    accessorKey: 'priceLevel',
    header: '가격 수준',
    cell: ({ row }) => <div>{row.getValue('priceLevel')}</div>,
  },
  {
    accessorKey: 'isActive',
    header: '상태',
    cell: ({ row }) => (
      <div
        className={`w-[10px] h-[10px] rounded-full ${row.getValue('isActive') ? 'bg-[#6378eb]' : 'bg-[#73ccd7]'}`}
      ></div>
    ),
  },
  {
    accessorKey: 'likeBooks',
    header: '책 선호 여부',
    cell: ({ row }) => <div>{row.getValue('likeBooks') ? '좋아요' : '싫어요'}</div>,
  },
  {
    accessorKey: 'PrivacyStatus',
    header: '개인정보 수집 동의 여부',
    cell: ({ row }) => <div>{row.getValue('PrivacyStatus') ? '동의' : '미동의'}</div>,
  },
];

export default function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = Number(searchParams.get('page')) || 1;

  const query = useQuery({
    queryKey: ['users', { ...searchParams }],
    queryFn: async () => {
      return await fetchUserList({ pageSize: 10, pageIndex: pageIndex - 1, ...searchParams });
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

  const handleSubmit = (data: { nickname: string; email: string }) => {
    setSearchParams((prev) => {
      data.nickname ? prev.set('nickname', data.nickname) : prev.delete('nickname');
      data.email ? prev.set('email', data.email) : prev.delete('email');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <BaseAdminPage title="사용자 관리">
      <AdminDataFilter
        onSubmit={handleSubmit}
        items={[
          {
            name: 'nickname',
            label: '닉네임',
          },
          {
            name: 'email',
            label: '이메일',
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
