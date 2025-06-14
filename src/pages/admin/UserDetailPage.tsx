import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

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

  return <div>UserDetailPage</div>;
}
