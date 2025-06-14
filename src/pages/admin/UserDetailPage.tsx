import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import BaseAdminPage from './BaseAdminPage';

export default function UserDetailPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = searchParams.get('id') || 1;

  const query = useQuery({
    queryKey: ['users', userId],
    queryFn: () => ({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St, Anytown, USA',
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
    }),
  });

  query.data?.id;

  return (
    <BaseAdminPage title="사용자 상세">
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-lg font-bold">사용자 상세</h2>
        </div>
      </div>
    </BaseAdminPage>
  );
}
