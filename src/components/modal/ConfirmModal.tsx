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
  title = "알림",
  message,
  confirmText = "확인",
  onConfirm,
}: Props) {
  const image = imgSrc ?? takeRabbit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[80vw] md:w-full max-w-[22rem] md:max-w-sm p-6 md:p-8 rounded-2xl bg-white shadow-xl"
           style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute right-3 md:right-4 top-3 md:top-4 text-2xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>

        {/* 중앙 이미지 (선택) */}
        <img
          src={image}
          alt={imgAlt ?? 'modal image'}
          className="mx-auto mb-4 h-22 md:h-28 w-22 md:w-28 object-contain"
        />

        {/* 제목 */}
        <h3 className="mb-2 text-center text-lg md:text-xl font-semibold">{title}</h3>

        {/* 본문 메시지 */}
        <div
          className="mb-6 text-center text-gray-600 whitespace-pre-wrap text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        {/* 확인 버튼 */}
        <button
          onClick={() => {
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
