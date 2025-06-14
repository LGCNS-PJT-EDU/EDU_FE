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
    accessorKey: 'contentDuration',
    header: '소요 시간',
    cell: ({ row }) => <div>{row.getValue('contentDuration')}</div>,
  },
  {
    accessorKey: 'contentLevel',
    header: '난이도',
    cell: ({ row }) => <div>{row.getValue('contentLevel')}</div>,
  },
  {
    accessorKey: 'contentPrice',
    header: '가격',
    cell: ({ row }) => <div>{row.getValue('contentPrice')}</div>,
  },
  {
    accessorKey: 'subId',
    header: '과목 ID',
    cell: ({ row }) => <div>{row.getValue('subId')}</div>,
  },
];

export default function ContentsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const contentTitle = searchParams.get('contentTitle') || '';
  const contentType = searchParams.get('contentType') || '';

  const query = useQuery({
    queryKey: contentTitle || contentType ? ['admin-contents', { page, contentTitle, contentType }] : ['admin-contents-without-filter'],
    queryFn: async () => {
      const data = await fetchContentList({
        page: page - 1,
        size: 10,
        contentTitle,
        contentType,
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

  const handleSubmit = (data: { contentTitle: string; contentType: string }) => {
    setSearchParams((prev) => {
      data.contentTitle ? prev.set('contentTitle', data.contentTitle) : prev.delete('contentTitle');
      data.contentType ? prev.set('contentType', data.contentType) : prev.delete('contentType');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleReset = () => {
    setSearchParams((prev) => {
      prev.delete('contentTitle');
      prev.delete('contentType');
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
            name: 'contentTitle',
            label: '제목',
          },
          {
            name: 'contentType',
            label: '유형',
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
