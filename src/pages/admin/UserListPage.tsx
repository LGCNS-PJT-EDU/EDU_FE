import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import BaseAdminPage from './BaseAdminPage';
import { fetchUserList, LoginType, PriceLevel, StudyTime, User } from '@/api/adminService';
import AdminPagination from './AdminPagination';
import AdminDataTable from './AdminDataTable';
import AdminDataFilter from './AdminDataFilter';
import { Badge } from '@/components/ui/badge';

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
    cell: ({ row }) => {
      const loginType = row.getValue('loginType') as LoginType;
      const getLoginTypeColor = (loginType: LoginType) => {
        switch (loginType) {
          case 'LOCAL':
            return 'bg-[#6378eb]';
          case 'KAKAO':
            return 'bg-[#FEE500] text-[#000000]';
          case 'NAVER':
            return 'bg-[#03c75a]';
          case 'GOOGLE':
            return 'bg-[#000000]';
        }
      };
      return <Badge className={`${getLoginTypeColor(loginType)}`}>{loginType}</Badge>;
    },
  },
  {
    accessorKey: 'lectureAmount',
    header: '1일 학습 가능 시간',
    cell: ({ row }) => {
      const lectureAmount = row.getValue('lectureAmount') as StudyTime;
      const getLectureAmountLabel = (lectureAmount: StudyTime) => {
        switch (lectureAmount) {
          case 'HOUR_1':
            return '1시간 이하';
          case 'HOUR_3':
            return '1시간 이상 3시간 이하';
          case 'HOUR_5':
            return '3시간 이상 5시간 이하';
          case 'HOUR_10':
            return '5시간 이상 10시간 이하';
          case 'OVER_10':
            return '10시간 이상';
        }
      };
      return <Badge variant="outline">{getLectureAmountLabel(lectureAmount)}</Badge>;
    },
  },
  {
    accessorKey: 'priceLevel',
    header: '예산',
    cell: ({ row }) => {
      const priceLevel = row.getValue('priceLevel') as PriceLevel;
      const getPriceLevelLabel = (priceLevel: PriceLevel) => {
        switch (priceLevel) {
          case 'FREE':
            return '무료';
          case 'UNDER_50K':
            return '5만원 이하';
          case 'BETWEEN_50K_100K':
            return '5만원 이상 10만원 이하';
          case 'BETWEEN_100K_200K':
            return '10만원 이상 20만원 이하';
          case 'BETWEEN_200K_500K':
            return '20만원 이상 50만원 이하';
          case 'OVER_500K':
            return '50만원 이상';
        }
      };
      return <Badge variant="outline">{getPriceLevelLabel(priceLevel)}</Badge>;
    },
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
    cell: ({ row }) => <div>{row.getValue('likeBooks') ? '예' : '아니오'}</div>,
  },
  {
    accessorKey: 'PrivacyStatus',
    header: '개인정보 수집 동의 여부',
    cell: ({ row }) => <div>{row.getValue('PrivacyStatus') ? '동의' : '미동의'}</div>,
  },
];

export default function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;

  const query = useQuery({
    queryKey: ['users', { ...searchParams }],
    queryFn: async () => {
      return await fetchUserList({ page: page - 1, size: 10 });
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

  const handleReset = () => {
    setSearchParams((prev) => {
      prev.delete('nickname');
      prev.delete('email');
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <BaseAdminPage title="사용자 관리">
      <AdminDataFilter
        onSubmit={handleSubmit}
        onReset={handleReset}
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
        pageIndex={page}
        totalPages={query.data?.totalPages || 0}
        setPage={setPage}
      />
    </BaseAdminPage>
  );
}
