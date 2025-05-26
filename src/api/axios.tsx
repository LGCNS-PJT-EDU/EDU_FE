import { getAccessToken } from '@/store/authGlobal';
import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* 로컬 스토리지에 accesstoken 있으면 헤더에 추가 */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  console.log("[axios] token:", token); 

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
