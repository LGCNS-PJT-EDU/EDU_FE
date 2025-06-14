import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import BaseAdminPage from './BaseAdminPage';
import { fetchUserList, User } from '@/api/adminService';
import { Button } from '@/components/ui/button';

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
    header: '활성화 여부',
    cell: ({ row }) => <div>{row.getValue('isActive') ? '활성화' : '비활성화'}</div>,
  },
  {
    accessorKey: 'likeBooks',
    header: '좋아요 여부',
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
    queryKey: ['users', pageIndex], 
    queryFn: () => fetchUserList({ pageSize: 10, pageIndex: pageIndex - 1 }),
  });

  const table = useReactTable({
    data: query.data?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <BaseAdminPage title="사용자 관리">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button variant="outline" disabled={pageIndex === 1} onClick={() => {
              setSearchParams((prev) => {
                prev.set('page', (Number(prev.get('page')) - 1).toString());
                return prev;
              });
            }}>이전</Button>
          </PaginationItem>
          {
            Array.from({length: query.data?.totalPages || 0}, (_, index) => (
              <PaginationItem key={index}>
                <Button variant={ pageIndex === index + 1 ? "default" : "ghost"} onClick={() => {
                  setSearchParams((prev) => {
                    prev.set('page', (index + 1).toString());
                    return prev;
                  });
                }}>{index + 1}</Button>
              </PaginationItem>
            ))
          }
          <PaginationItem>  
            <Button variant="outline" disabled={!query.data?.totalPages || pageIndex === query.data?.totalPages} onClick={() => {
              setSearchParams((prev) => {
                prev.set('page', (Number(prev.get('page')) + 1).toString());
                return prev;
              });
            }}>다음</Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </BaseAdminPage>
  );
}
