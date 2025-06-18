import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import BaseAdminPage from './BaseAdminPage';
import { fetchContentList, Content } from '@/api/adminService';
import AdminPagination from './AdminPagination';
import AdminDataTable from './AdminDataTable';
import AdminDataFilter from './AdminDataFilter';

interface ContentWithId extends Content {
  id: string;
}

const columns: ColumnDef<ContentWithId>[] = [
  {
    accessorKey: 'totalContentId',
    header: '컨텐츠 ID',
    cell: ({ row }) => <div>{row.getValue('totalContentId')}</div>,
  },
  {
    accessorKey: 'contentTitle',
    header: '제목',
    cell: ({ row }) => <div>{row.getValue('contentTitle')}</div>,
  },
  {
    accessorKey: 'contentType',
    header: '유형',
    cell: ({ row }) => <div>{row.getValue('contentType')}</div>,
  },
  {
    accessorKey: 'contentPlatform',
    header: '플랫폼',
    cell: ({ row }) => <div>{row.getValue('contentPlatform')}</div>,
  },
  {
    accessorKey: 'subName',
    header: '과목명',
    cell: ({ row }) => <div>{row.getValue('subName')}</div>,
  },
];

export default function ContentsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const title = searchParams.get('title') || '';
  const subName = searchParams.get('subName') || '';

  const query = useQuery({
    queryKey: title || subName ? ['admin-contents', { page, title, subName }] : ['admin-contents-without-filter'],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const data = await fetchContentList({
        page: page - 1,
        size: 10,
        title,
        subName,
      });
      return {
        ...data,
        content: data.content.map((content) => ({
          ...content,
          id: content.totalContentId.toString(),
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

  const handleSubmit = (data: { title: string; subName: string }) => {
    setSearchParams((prev) => {
      data.title ? prev.set('title', data.title) : prev.delete('title');
      data.subName ? prev.set('subName', data.subName) : prev.delete('subName');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams((prev) => {
      prev.delete('title');
      prev.delete('subName');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <BaseAdminPage title="컨텐츠 관리">
      <AdminDataFilter
        onSubmit={handleSubmit}
        onReset={handleReset}
        items={[
          {
            name: 'title',
            label: '제목',
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
