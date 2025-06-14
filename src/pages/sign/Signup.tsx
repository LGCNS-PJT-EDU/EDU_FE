import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import pixel_texture from '@/asset/img/common/pixel_texture.png';
import main from '@/asset/img/common/main.png';
import { useCheckEmailMutation, useSignupMutation } from '@/hooks/useMutation';
import responsiveBG from '@/asset/img/common/resposive_pixel_texture.png';
import SignupTermsModal from '@/components/modal/SignupTermsModal';
import { AnimatePresence, motion } from 'framer-motion';

function Signup() {
  const [email, setEmail] = useState<string>('');
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');

  const [pwValid, setPwValid] = useState(false);
  const [pwMatch, setPwMatch] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const checkEmailMutation = useCheckEmailMutation();
  const signupMutation = useSignupMutation();

  const [agreed, setAgreed] = useState(false);

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
    if (pw.length < 8 || pw.length > 15) return false;
    const hasEng = /[A-Za-z]/.test(pw);
    const hasNum = /[0-9]/.test(pw);
    const hasSpc = /[^A-Za-z0-9]/.test(pw);
    return hasEng && hasNum && hasSpc;
  };

  // 비밀번호 입력 변화 핸들러
  const handlePwChange = (v: string) => {
    setPassword(v);
    const valid = isPasswordValid(v);
    setPwValid(valid);
    // 비밀번호 바뀔 때마다 일치 여부 재평가
    setPwMatch(passwordCheck ? v === passwordCheck : null);
  };
  // 비밀번호 확인 입력 변화 핸들러
  const handlePwCheckChange = (v: string) => {
    setPasswordCheck(v);
    setPwMatch(v ? password === v : null);
  };

  // 회원가입 처리
  const handleSignup = async () => {
    if (!agreed || !isEmailAvailable || !pwValid || !pwMatch) return;
    await signupMutation.mutateAsync({ email, nickname, password });
    navigate('/login');
  };

  const canShowPwSection = isEmailAvailable;
  const canShowJoinButton = canShowPwSection && pwValid && pwMatch && agreed;

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
                      p-10 md:p-[60px_40px]
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
              disabled={!isValidEmail(email)}
              className="px-3 py-2 text-sm rounded-lg
                         bg-[#6378EB] text-white disabled:bg-gray-300"
            >
              중복확인
            </button>
          </div>
          {isEmailAvailable !== null && (
            <p className={`text-sm mt-1 ${isEmailAvailable ? 'text-green-600' : 'text-red-500'}`}>
              {isEmailAvailable ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.'}
            </p>
          )}
        </div>
        <AnimatePresence>
          {canShowPwSection && (
            <motion.div
              key="pw-section"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-2"
            >
              <label className="text-sm font-semibold text-[#373F41]">비밀번호</label>
              <input
                type="password"
                value={password}
                placeholder="비밀번호"
                onChange={(e) => handlePwChange(e.target.value)}
                className="border border-[#ccc] px-4 py-2 rounded-lg text-sm"
              />
              {!password && (
                <p className="ml-3 text-xs text-[#999] mt-2">
                  8~15자 / 영문, 숫자, 특수문자 모두 포함
                </p>
              )}
              {password && (
                <p className={`text-sm mt-1 ${pwValid ? 'text-green-600' : 'text-red-500'}`}>
                  {pwValid
                    ? '사용 가능한 비밀번호입니다.'
                    : '8~15자 / 영문, 숫자, 특수문자 모두 포함'}
                </p>
              )}
              <label className="text-sm font-semibold text-[#373F41]">비밀번호 확인</label>
              <input
                type="password"
                value={passwordCheck}
                placeholder="비밀번호 확인"
                onChange={(e) => handlePwCheckChange(e.target.value)}
                className="border border-[#ccc] px-4 py-2 rounded-lg text-sm"
              />
              {pwMatch !== null && (
                <p className={`text-sm mt-1 ${pwMatch ? 'text-green-600' : 'text-red-500'}`}>
                  {pwMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canShowJoinButton && (
            <motion.div
              key="join-btn"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="w-full py-3 bg-[#6378EB] text-white rounded-xl font-semibold hover:bg-[#3fa9b8] transition"
                onClick={handleSignup}
              >
                회원가입
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {!agreed && <SignupTermsModal onAgree={() => setAgreed(true)} />}
      </div>
    </div>
  );
}

export default Signup;
