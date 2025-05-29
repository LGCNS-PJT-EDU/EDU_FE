import { getAccessToken, useAuthStore } from '@/store/authGlobal';
import axios, { AxiosError, AxiosRequestHeaders } from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* 로컬 스토리지에 accesstoken 있으면 헤더에 추가 */
api.interceptors.request.use((cfg) => {
  const token = getAccessToken();
  console.log("토큰 있음", token); 

  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  } else if (cfg.headers?.Authorization) {
    delete cfg.headers.Authorization;
  }
  return cfg;
});

/* 401에러 -> refreshToken 넘기고 새로운 accessToken 받아오기 */
let refreshing = false;
let queue: ((t: string | null) => void)[] = [];

const pushQueue = (cb: (t: string | null) => void) => queue.push(cb);
const resolveQueue = (token: string | null) => { queue.forEach((f) => f(token)); queue = []; };

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (!err.config) return Promise.reject(err);

    const config = err.config;
    const { response } = err;

    if (!response || response.status !== 401 || (config as any)._retry) {
      return Promise.reject(err);
    }
    (config as any)._retry = true;

    if (refreshing) {
      return new Promise((resolve, reject) => {
        pushQueue((newToken) => {
          if (!newToken) return reject(err);
          (config.headers ??= {} as AxiosRequestHeaders).Authorization = `Bearer ${newToken}`;
          resolve(api(config));
        });
      });
    }

    refreshing = true;
    try {
      const r = await api.get('/api/user/refresh');
      const newAccess =
        r.data?.data?.accessToken ??
        r.headers['authorization']?.split(' ')[1];
      if (!newAccess) throw new Error('refresh failed');

      useAuthStore.getState().setLogin(newAccess);
      api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
      resolveQueue(newAccess);

      (config.headers ??= {} as AxiosRequestHeaders).Authorization = `Bearer ${newAccess}`;
      return api(config);
    } catch (e) {
      useAuthStore.getState().setLogout();
      resolveQueue(null);
      window.dispatchEvent(new Event('sessionExpired'));
      return Promise.reject(e);
    } finally {
      refreshing = false;
    }
  }
);

export default api;
