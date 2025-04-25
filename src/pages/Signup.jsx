// src/components/Signup.jsx
import React, { useState } from 'react';
import './Signup.css';
import axios from '../api/axios';

function Signup() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);

  return (
    <div className="signupArticle">
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
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChecked(false); 
            }}
          />
          <button type="button" onClick={checkEmail} className='repeatBtn'>
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
      </div>

      <button className="submitBtn" onClick={signup}>
        Join in
      </button>
    </div>
  );
}

export default Signup;
