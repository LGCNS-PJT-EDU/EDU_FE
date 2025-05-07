import axios, { InternalAxiosRequestConfig  } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* 로컬 스토리지에 accesstoken 있으면 헤더에 추가 */
api.interceptors.request.use((config: InternalAxiosRequestConfig ) => {
  const token = localStorage.getItem('accesstoken');
  
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else if(config.headers) {
    delete config.headers.Authorization;   // 토큰 없으면 제거
  }
  return config;
});

export default api;