import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgreeModalProps {
  onAgree : () => void;
  onClose : () => void;
}

export default function AgreeModal({ onAgree, onClose }: AgreeModalProps) {
  const [agreeRecord, setAgreeRecord] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const [openRecord, setOpenRecord] = useState(false);
  const [openPolicy, setOpenPolicy] = useState(false);

  const all = agreeRecord && agreePolicy;
  const toggleAll = (checked: boolean) => {
    setAgreeRecord(checked);
    setAgreePolicy(checked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit   ={{ scale: 0.85, opacity: 0 }}
        className="relative w-[80vw] md:w-full max-w-xl
                   max-h-[80vh] overflow-y-auto
                   rounded-2xl bg-white p-8 shadow-xl font-[pretendard] space-y-6"
      >
        {/* 닫기(X) */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="close"
        >
          <X size={24} />
        </button>

        {/* 인트로 문구 */}
        <div className="space-y-2">
          <p className="text-center font-bold text-base md:text-lg">
            면접 기능 이용을 위한 <br/> 개인정보 수집·이용 동의
          </p>
        </div>

        {/* 녹음 기능 이용에 관한 안내 */}
        <section className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between px-4 py-3 font-semibold"
            onClick={() => setOpenRecord(!openRecord)}
          >
            <span>녹음 기능 이용에 관한 안내</span>
            <span>{openRecord ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence initial={false}>
            {openRecord && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 text-sm space-y-2
                           max-h-[12vh] overflow-y-auto custom-scroll"
              >
                <p>1. 회사는 서비스 제공을 위해 사용자 음성 입력을 녹음하는 기능을 제공하며, 이는 브라우저 기반에서만 동작합니다.</p>
                <p>2. 녹음된 내용은 사용자가 응답한 질문에 대한 답변 확인 목적으로 일시적으로 제공되며, 다음과 같은 조건을 포함합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>녹음은 사용자의 기기 내에서만 일시 저장됩니다.</li>
                  <li>사용자는 녹음 완료 후 본인의 응답을 청취하거나 다운로드할 수 있습니다.</li>
                  <li>페이지를 벗어나거나 새로고침 시 해당 음성 데이터는 자동 삭제됩니다.</li>
                </ul>
                <p>3. 회사는 녹음된 내용을 수집·저장·전송하지 않습니다.</p>
                <p>4. 회사는 위 정책을 엄격히 준수하며 사용자는 이에 동의하고 서비스를 이용합니다.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 음성 녹음 데이터의 처리 방침 */}
        <section className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between px-4 py-3 font-semibold"
            onClick={() => setOpenPolicy(!openPolicy)}
          >
            <span>음성 녹음 데이터의 처리 방침</span>
            <span>{openPolicy ? '▲' : '▼'}</span>
          </button>

          <AnimatePresence initial={false}>
            {openPolicy && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 text-sm space-y-2
                           max-h-[12vh] overflow-y-auto custom-scroll"
              >
                <p>회사는 브라우저의 <code>mediaRecorder</code> API를 사용하여 사용자의 음성을 녹음합니다.</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>
                    <strong>저장 방식</strong> – 음성 데이터는 사용자의 브라우저 메모리에만 임시 저장되고, 회사 서버로 전송되지 않습니다.
                  </li>
                  <li>
                    <strong>이용 목적</strong> – 사용자는 녹음 종료 후 재생·다운로드가 가능하며, 이는 본인 답변을 복습하기 위한 기능입니다.
                  </li>
                  <li>
                    <strong>자동 삭제</strong> – 페이지 이탈·새로고침 시 즉시 삭제되며 복구할 수 없습니다.
                  </li>
                  <li>
                    <strong>제3자 제공</strong> – 어떠한 경우에도 녹음 데이터를 외부에 제공하지 않습니다.
                  </li>
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 구분선 */}
        <hr />

        {/* 개별 체크박스 */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agreeRecord}
              onChange={(e) => setAgreeRecord(e.target.checked)}
            />
            <span className="text-sm">녹음 기능 이용에 관한 안내 (필수)</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agreePolicy}
              onChange={(e) => setAgreePolicy(e.target.checked)}
            />
            <span className="text-sm">음성 녹음 데이터의 처리 방침 (필수)</span>
          </label>

          <label className="flex items-center space-x-2 font-medium">
            <input
              type="checkbox"
              checked={all}
              onChange={(e) => toggleAll(e.target.checked)}
            />
            <span className="text-sm">모두 동의</span>
          </label>
        </div>

        {/* 동의하고 계속 버튼 */}
        <AnimatePresence>
        {all && (
          <motion.div
            key="agree-btn"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full mt-2"
            >
            <Button
                className="w-full"
                style={{ backgroundColor: '#6378EB', color: '#fff' }}
                onClick={onAgree}
            >
                동의하고 계속
            </Button>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}