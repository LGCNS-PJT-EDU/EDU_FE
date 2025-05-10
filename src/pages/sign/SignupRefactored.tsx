import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/api/axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const isPasswordValid = (pw: string): boolean => {
  if (pw.length < 6 || pw.length > 20) return false;

  const upper = /[A-Z]/.test(pw);
  const lower = /[a-z]/.test(pw);
  const number = /[0-9]/.test(pw);
  const special = /[^A-Za-z0-9]/.test(pw);

  const count = [upper, lower, number, special].filter(Boolean).length;

  return count >= 2;
};

const formSchema = z.object({
  nickname: z.string().min(1, { message: '닉네임을 입력해주세요' }),
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요' })
    .email({ message: '올바른 이메일 형식으로 입력해주세요' }),
  password: z
    .string()
    .min(6)
    .max(20)
    .refine(isPasswordValid, {
      message: '비밀번호는 6-20자이며, 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합이어야 합니다',
    }),
  passwordConfirm: z.string().min(1),
}).refine(
  (data) => data.password === data.passwordConfirm,
  {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  }
);

type SignupFormData = z.infer<typeof formSchema>;

function SignupRefactored() {

  const form = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
  });


  const onEmailCheck = async () => {
    console.log("중복확인")
  };

  const onSubmit = form.handleSubmit((data: SignupFormData) => {
    console.log(data);
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="py-10 px-4 min-w-lg max-w-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">안녕하세요 TakeIT에 오신것을 환영합니다</p>
            <h1 className="text-2xl font-bold">Create an Account</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <Button variant="outline" type="button" onClick={onEmailCheck}>중복확인</Button>
                  </div>
                  <FormMessage />
                </FormItem> 
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Confirm</FormLabel>
                  <FormControl>
                      <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">GET STARTED</Button>
            </form>
          </Form>
          <hr className="my-8"/>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupRefactored;
