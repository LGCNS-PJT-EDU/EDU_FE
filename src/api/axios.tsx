import axios, { AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, useAuthStore } from '@/store/authGlobal';


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

function isRefreshUrl(url?: string) {
  return url?.includes('/api/user/refresh');
}

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (isRefreshUrl(cfg.url)) {
    if (cfg.headers?.Authorization) delete cfg.headers.Authorization;
    return cfg;
  }

  if (token) {
    (cfg.headers ??= {} as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
  } else if (cfg.headers?.Authorization) {
    delete cfg.headers.Authorization;
  }
  return cfg;
});

/* 401에러 -> refreshToken 넘기고 새로운 accessToken 받아오기 */
let refreshing = false;
let queue: ((t: string | null) => void)[] = [];

const pushQueue     = (cb: (t: string | null) => void) => queue.push(cb);
const resolveQueue  = (token: string | null) => { queue.forEach(f => f(token)); queue = []; };

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (!err.config) return Promise.reject(err);

    const cfg       = err.config;
    const { status }= err.response ?? {};

    if (isRefreshUrl(cfg.url)) {
      useAuthStore.getState().setLogout();
      window.dispatchEvent(new Event('sessionExpired'));
      return Promise.reject(err);
    }
    
    if (status !== 401 || (cfg as any)._retry) {
      return Promise.reject(err);
    }
    (cfg as any)._retry = true;

    if (refreshing) {
      return new Promise((resolve, reject) => {
        pushQueue((newToken) => {
          if (!newToken) return reject(err);
          (cfg.headers ??= {} as AxiosRequestHeaders).Authorization = `Bearer ${newToken}`;
          resolve(api(cfg));
        });
      });
    }

    refreshing = true;
    try {
      const r = await api.post('/api/user/refresh');
      const newAccess =
        r.data?.data?.accessToken ??
        r.headers['authorization']?.split(' ')[1];

      if (!newAccess) throw new Error('refresh failed');

      useAuthStore.getState().setLogin(newAccess);
      api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
      resolveQueue(newAccess);

      (cfg.headers ??= {} as AxiosRequestHeaders).Authorization = `Bearer ${newAccess}`;
      return api(cfg);
    } catch (e) {
      // refresh 실패 → 세션 만료
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
