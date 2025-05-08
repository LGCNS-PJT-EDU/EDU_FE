import { getAccessToken } from '@/store/authGlobal';
import axios, { InternalAxiosRequestConfig  } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* 로컬 스토리지에 accesstoken 있으면 헤더에 추가 */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  console.debug("[interceptor] token:", token);   // 추가

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;