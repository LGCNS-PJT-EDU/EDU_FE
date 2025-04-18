import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Hello = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // API 호출
    axios.get('http://localhost:8080/api/hello') // 서버 주소에 맞게 수정
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('API 호출 중 오류 발생:', error);
        setMessage('API 호출 실패');
      });
  }, []);

  return (
    <div>
      <h1>서버로부터 받은 메시지:</h1>
      <p>{message}</p>
    </div>
  );
};

export default Hello;
