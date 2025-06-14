import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import pixel_texture from '@/asset/img/common/pixel_texture.png';
import main from '@/asset/img/common/main.png';
import { useCheckEmailMutation, useSignupMutation } from '@/hooks/useMutation';
import responsiveBG from '@/asset/img/common/resposive_pixel_texture.png';

function Signup() {
  const [email, setEmail] = useState<string>('');
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');

  const navigate = useNavigate();
  const checkEmailMutation = useCheckEmailMutation();
  const signupMutation = useSignupMutation();

  // 이메일 유효성 검사
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!isValidEmail(email)) {
      alert('올바른 이메일 형식으로 입력해주세요.');
      return;
    }
    try {
      const isAvailable = await checkEmailMutation.mutateAsync(email);
      setIsEmailAvailable(isAvailable);
      alert(isAvailable ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.');
    } catch {
      alert('중복 확인을 다시 해주세요!');
    }
  };

  // 비밀번호 유효성 검사
  const isPasswordValid = (pw: string): boolean => {
    if (pw.length < 6 || pw.length > 20) return false;

    const upper = /[A-Z]/.test(pw);
    const lower = /[a-z]/.test(pw);
    const number = /[0-9]/.test(pw);
    const special = /[^A-Za-z0-9]/.test(pw);

    const count = [upper, lower, number, special].filter(Boolean).length;

    return count >= 2;
  };

  // 회원가입 처리
  const handleSignup = async () => {
    if (!isEmailAvailable) {
      alert('이메일 중복 확인을 해주세요.');
      return;
    }

    if (!isPasswordValid(password)) {
      alert(
        '비밀번호는 6-20자이며, 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합이어야 합니다.'
      );
      return;
    }

    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signupMutation.mutateAsync({ email, nickname, password });
      alert('회원가입 완료되었습니다!');
      navigate('/login');
    } catch (e) {
      alert('다시 확인해주세요.');
    }
  };

  return (
    <div className="relative h-[calc(100vh-70px)] font-[pretendard] flex flex-col md:flex-row items-center md:items-start justify-center gap-[200px] overflow-hidden px-0 md:px-4">
      <img
        src={pixel_texture}
        alt=""
        className="hidden md:block absolute bottom-0 left-0 w-full h-[100%] object-cover z-0 opacity-70"
      />
      <img
        src={responsiveBG}
        alt=""
        className="block md:hidden absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 배너 */}
      <div className="hidden md:flex relative justify-center items-center self-center">
        <div className="z-20 text-[#373f41]">
          <img src={main} alt="main" className="w-[200px] mb-[10px]" />
          <p className="text-xl text-[#6378EB] font-[NeoDunggeunmo]">
            회원가입을 진행해주세요.
            <br />
            지금 TakeIT과 시작해보세요
          </p>
        </div>
      </div>

      {/* 회원가입 박스 */}
      <div
        className="relative w-full max-w-[450px]
                      md:w-full md:max-w-[400px]
                      max-md:-mx-4
                      mb-25 mt-80 md:my-15
                      translate-y-8 md:translate-y-0
                      p-10 md:p-[60px_70px]
                      bg-white rounded-[40px] md:rounded-[30px]
                      flex flex-col gap-5 shadow-[ -4px_0_10px_rgba(0,0,0,0.05)] 
                      border border-[#E0E0E0] min-h-[calc(100vh-200px)]"
      >
        <p className="text-sm">안녕하세요! TakeIT에 오신 것을 환영합니다.</p>
        <h2 className="mt-2 mb-3 text-xl font-semibold">회원가입</h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#373F41]">닉네임</label>
          <input
            type="text"
            value={nickname}
            placeholder="닉네임"
            onChange={(e) => setNickname(e.target.value)}
            className="border border-[#ccc] px-4 py-2 rounded-lg text-sm"
          />

          <label className="text-sm font-semibold text-[#373F41]">이메일</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              placeholder="이메일"
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailAvailable(null);
              }}
              className="flex-1 border border-[#ccc] px-4 py-2 rounded-lg text-sm"
            />
            <button
              type="button"
              onClick={handleCheckEmail}
              className="px-3 py-2 whitespace-nowrap text-sm bg-[#6378EB] text-white rounded-lg"
            >
              중복확인
            </button>
          </div>

          <label className="text-sm font-semibold text-[#373F41]">비밀번호</label>
          <input
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#ccc] px-4 py-2 rounded-lg text-sm"
          />

          <label className="text-sm font-semibold text-[#373F41]">비밀번호 확인</label>
          <input
            type="password"
            value={passwordCheck}
            placeholder="비밀번호 확인"
            onChange={(e) => setPasswordCheck(e.target.value)}
            className="border border-[#ccc] px-4 py-2 rounded-lg text-sm"
          />

          {passwordCheck && (
            <p
              className={`text-sm mt-1 ${password === passwordCheck ? 'text-green-600' : 'text-red-500'}`}
            >
              {password === passwordCheck
                ? '비밀번호가 일치합니다.'
                : '비밀번호가 일치하지 않습니다.'}
            </p>
          )}

          <p className="text-xs text-[#999] mt-2">
            6~20자 / 영문 대·소문자, 숫자, 특수문자 중 2가지 이상 조합
          </p>

          <button
            className="mt-6 py-3 bg-[#6378EB] text-white rounded-xl font-semibold hover:bg-[#3fa9b8] transition"
            onClick={handleSignup}
          >
            Join In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
