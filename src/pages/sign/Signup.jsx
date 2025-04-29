// src/components/Signup.jsx
import React, { useState } from 'react';
import '../../styled/signup.css';
import axios from '../../api/axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  

  //이메일 유효성 검사
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //이메일 중복확인
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
      const res = await axios.get(`/api/user/check-email`, {
        params: { email }
      });
      console.log('서버 응답:', res.data); 
      if (res.data) {
        alert('사용 가능한 이메일입니다.');
        setIsEmailAvailable(true);
      } else {
        alert('이미 사용 중인 이메일입니다.');
        setIsEmailAvailable(false);
      }
    } catch (err) {
      console.error(err);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };
  
  //비밀번호 유효성 검사
  const isPasswordValid = (pw) => {
    if (pw.length < 6 || pw.length > 20) return false;
  
    const upper = /[A-Z]/.test(pw);
    const lower = /[a-z]/.test(pw);
    const number = /[0-9]/.test(pw);
    const special = /[^A-Za-z0-9]/.test(pw);
  
    const count = [upper, lower, number, special].filter(Boolean).length;
  
    return count >= 2;
  };

  //회원가입 
  const handleSignup = async () => {
    if (!isEmailAvailable) {
      alert('이메일 중복 확인을 해주세요.');
      return;
    }

    if (!isPasswordValid(password)) {
      alert('비밀번호는 6-20자이며, 영문 대/소문자, 숫자, 특수문자 중 2가지 이상 조합이어야 합니다.');
      return;
    }
  
    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await axios.post('/api/user/signup', {
        email,
        nickname,
        password,
      });

      if (res.status === 201 || res.status === 200) {
        alert('회원가입이 완료되었습니다!');
        // 회원가입 성공 시 로그인 페이지로 이동 등 추가 동작
      }
    } catch (err) {
      console.error(err);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };


  return (
    <section id="articles">
      <h2 className="title_sign">회원가입</h2>
      <p className="subtitle">회원정보를 입력해주세요</p>

      <div className="formGroup">
        <label>닉네임</label>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <label>이메일</label>
        <div className="repeat">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" className='repeatBtn' onClick={handleCheckEmail}>
            중복확인
          </button>
        </div>

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <p
          className="passwordGuide"
          style={{
            display: passwordCheck.length > 0 ? 'block' : 'none',
            color: password === passwordCheck ? 'green' : 'red',
            fontSize : 13
        }}
        >
        {password === passwordCheck ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
        </p>
        
        <p className="passwordconfirm">6-20자 / 영문 대문자, 소문자, 숫자, 특수문자 중 2가지 조합</p>
      </div>

      <button className="submitBtn" onClick={handleSignup}>
        Join in
      </button>
    </section>
  );
}

export default Signup;
