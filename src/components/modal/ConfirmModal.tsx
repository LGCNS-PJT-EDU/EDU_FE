import { useNavigate } from 'react-router-dom';
import takeRabbit from '@/asset/img/common/takeRabbit.png';

export interface WithImage {
  imgSrc?: string;
  imgAlt?: string;
}

interface Props extends WithImage {
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export default function ConfirmModal({
  onClose,
  imgSrc,
  imgAlt,
  title,
  message,
  confirmText,
  onConfirm,
}: Props) {
  const navigate = useNavigate();
  const image = imgSrc ?? takeRabbit;

  const handleConfirm = () => {
    onConfirm?.(); //선택적으로 실행
    onClose();
  };

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

        {/* 제목 */}
        <h3 className="mb-2 text-center text-xl font-semibold">{title}</h3>

        {/* 본문 메시지 */}
        <p className="mb-6 text-center text-gray-600 whitespace-pre-wrap">{message}</p>

        <button
          onClick={() => {
            onClose();
            onConfirm?.();
          }}
          className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
