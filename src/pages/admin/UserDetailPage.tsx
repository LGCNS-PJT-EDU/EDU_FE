import { Form, useLocation } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import BaseAdminPage from './BaseAdminPage';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UserDetailPage() {
  const form = useForm();
  const { register, handleSubmit } = form;
  const location = useLocation();

  const userId = location.pathname.split('/').pop();

  const query = useQuery({
    queryKey: ['users', userId],
    enabled: !!userId,
    queryFn: () => ({
      id: `${userId}`,
      userId: userId,
      email: `user${userId}@user.com`,
      nickname: `user${userId}`,
      loginType: 'LOCAL',
      lectureAmount: '10',
      priceLevel: '10',
      isActive: true,
      likeBooks: false,
      PrivacyStatus: false,
    }),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <BaseAdminPage title="사용자 상세" showBackButton>
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[10px]">
        <Label htmlFor="nickname">닉네임</Label>
        <Input {...register('nickname')} />
        <Label htmlFor="email">이메일</Label>
        <Input {...register('email')} />
        <Label htmlFor="loginType">로그인 타입</Label>
        <Input {...register('loginType')} />
        <Label htmlFor="lectureAmount">강의 수</Label>
        <Input {...register('lectureAmount')} />
        <Label htmlFor="priceLevel">가격 수준</Label>
        <Input {...register('priceLevel')} />
        <Label htmlFor="isActive">상태</Label>
        <Select {...register('isActive')}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">활성</SelectItem>
            <SelectItem value="false">비활성</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="likeBooks">책 선호 여부</Label>
        <Select {...register('likeBooks')}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">선호</SelectItem>
            <SelectItem value="false">비선호</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="PrivacyStatus">개인정보 수집 동의 여부</Label>
        <Select {...register('PrivacyStatus')}> 
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">동의</SelectItem>
            <SelectItem value="false">비동의</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Submit</Button>
      </Form>
    </BaseAdminPage>
  );
}
