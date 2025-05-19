import { useNavigate } from 'react-router-dom';
import takeRabbit from '@/asset/img/common/takeRabbit.png';

export interface WithImage {
  imgSrc?: string;
  imgAlt?: string;
}

interface Props extends WithImage {
  onClose: () => void;
}

export default function LoginRequiredModal({ onClose, imgSrc, imgAlt }: Props) {
  const navigate = useNavigate();
  const image = imgSrc ?? takeRabbit;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        {/* 닫기 버튼 */}
        <button
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>

        {/* 중앙 이미지 (선택) */}
        <img
          src={image}
          alt={imgAlt ?? 'modal image'}
          className="mx-auto mb-4 h-28 w-28 object-contain"
        />

        <h3 className="mb-2 text-center text-xl font-semibold">로그인이 필요합니다!</h3>
        <p className="mb-6 text-center text-gray-600">
          개인화 로드맵 저장 및 과목 상세 조회는 <br /> 로그인 후 이용하실 수 있어요.
        </p>

        <button
          onClick={() => {
            onClose();
            navigate('/login');
          }}
          className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          로그인 하러가기
        </button>
      </div>
    </div>
  );
}
