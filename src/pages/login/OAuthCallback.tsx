import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authGlobal';
import useLogin from '@/hooks/useLogin';

type Provider = 'naver' | 'kakao' | 'google' | 'local';

/* loginType에 provider를 대문자로 넣기 */
const toLoginType = (provider: string): string =>
  provider.toLowerCase() === 'local' ? 'LOCAL' : provider.toUpperCase();

/* 네이버만 POST body에 state 포함하기 */
const buildBody = ({
  code,
  state,
  provider,
}: {
  code: string;
  state: string | null;
  provider: string;
}) => ({
  code,
  loginType: toLoginType(provider),
  ...(provider.toLowerCase() === 'naver' && { state }),
});

function OAuthCallback() {
  const { provider = '' } = useParams<{ provider?: Provider }>(); // naver | kakao | google | local
  const { search } = useLocation(); // ?code=...&state=...
  const navigate = useNavigate();
  const ranOnce = useRef(false); // Strict-mode 방지
  const saveAccessToken = useLogin();

  /* 실제 요청 */
  const setLogin = useAuthStore((s) => s.setLogin);

  const requestLogin = useCallback(async () => {
    const qs = new URLSearchParams(search);
    const code = qs.get('code');
    const state = qs.get('state');
    if (!code || !provider) return navigate('/login');

    const body = buildBody({ code, state, provider });
    const res = await api.post(`/api/auth/${provider}/login`, body);

    /* stateCode 200인지 확인. 추후에 에러코드에 따라 에러팝업 출력 예정 */
    const { stateCode } = res.data ?? {};
    if (stateCode && stateCode !== 200) throw new Error(`stateCode ${stateCode}`);

    /* 토큰을 헤더에서 추출하기 */
    const token = res.headers['authorization']?.split(' ')[1];
    if (!token) throw new Error('token missing');

    saveAccessToken(token);
  }, [provider, search, navigate, setLogin]);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    requestLogin().catch((err: unknown) => {
      console.error('OAuth 처리 실패:', err);
      alert('로그인 실패');
      navigate('/login');
    });
  }, [requestLogin, navigate]);

  return <p style={{ textAlign: 'center', marginTop: '20%' }}>로그인&nbsp;처리&nbsp;중…</p>;
}

export default OAuthCallback;
