import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MODAL_SCALE = 2.7;

export interface FlipCardProps {
  title: string;
  subtitle: string;
  desc: React.ReactNode;
  back: React.ReactNode;
}

export default function FlipCard({ title, subtitle, desc, back }: FlipCardProps) {
  const [open, setOpen] = useState(false);
  const spring = { type: 'spring', stiffness: 160, damping: 18 };

  /* 공통 카드 스타일 */
  const cardClass =
    'card-3d w-[clamp(140px,45vw,180px)] aspect-[4/5] rounded-2xl ' +
    'bg-white p-6 shadow-md font-[Pretendard] flex flex-col items-center ' +
    'text-center gap-2';

  /* 앞·뒷면 JSX */
  const Faces = () => (
    <>
      {/* 앞면 */}
      <div className="card-face flex flex-col gap-2">
        <span className="text-sm font-bold text-[#6378EB]">{title}</span>
        <h3 className="mt-2 text-lg font-semibold text-gray-800">{subtitle}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-snug">{desc}</p>
        <button
          className="mt-5 w-s rounded-lg bg-[#7F94F2] px-4 py-2 text-sm text-white hover:bg-[#6378EB]"
          onClick={() => setOpen(true)}
        >
          자세히 보기
        </button>
      </div>

      {/* 뒷면 */}
      <div className="card-face card-face--back flex flex-col max-h-[80vh] max-w-[90vw] overflow-auto">
        {back}
        <button
          className="mt-3 self-center rounded-lg bg-[#6378EB] px-2 py-0.5 text-[0.65rem] text-white mb-0.5"
          onClick={() => setOpen(false)}
        >
          닫기
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 그리드 안 평상시 카드 */}
      <motion.div
        className={`${cardClass} ${open ? 'opacity-0 pointer-events-none' : ''}`}
        whileHover={{ scale: 1.04 }}
      >
        <Faces />
      </motion.div>

      {/* 모달 */}
      <AnimatePresence>
        {open && (
          <>
            {/* 백드롭 */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />

            {/* 중앙 wrapper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                className={cardClass}
                initial={{ rotateY: 0, scale: 0.8 }}
                animate={{ rotateY: 180, scale: MODAL_SCALE }}
                exit={{ rotateY: 0, scale: 0.8, transition: { duration: 0.15 } }}
                transition={spring}
              >
                <Faces />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
