import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FlipCardProps {
  title: string;
  subtitle: string;
  desc: React.ReactNode;
  back: React.ReactNode; // 💡 추가: 모달에 들어갈 각 카드별 내용
}

export default function FlipCard({ title, subtitle, desc, back }: FlipCardProps) {
  const [open, setOpen] = useState(false);
  const spring = { type: 'spring', stiffness: 160, damping: 18 };

  const cardClass =
    'w-[clamp(140px,45vw,180px)] aspect-[4/5] rounded-2xl bg-white p-6 shadow-md font-[Pretendard] flex flex-col items-center text-center gap-2';

  return (
    <>
      {/* 카드 앞면 */}
      <motion.div
        className={`${cardClass} ${open ? 'opacity-0 pointer-events-none' : ''}`}
        whileHover={{ scale: 1.04 }}
      >
        <span className="text-sm font-bold text-[#6378EB]">{title}</span>
        <h3 className="mt-2 text-lg font-semibold text-gray-800">{subtitle}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-snug">{desc}</p>
        <button
          className="mt-auto px-4 py-2 text-sm bg-[#7F94F2] text-white rounded-lg hover:bg-[#6378EB] transition"
          onClick={() => setOpen(true)}
        >
          자세히 보기
        </button>
      </motion.div>

      {/* 모달 */}
      <AnimatePresence>
        {open && (
          <>
            {/* 배경 */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />

            {/* 모달 본체 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col items-center p-6 text-center overflow-auto max-h-[90vh]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                {back}

                <button
                  onClick={() => setOpen(false)}
                  className="mt-4 bg-[#6378EB] text-white text-sm px-5 py-2 rounded-md hover:bg-[#5065c9] transition"
                >
                  닫기
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
