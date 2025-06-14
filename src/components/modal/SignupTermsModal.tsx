import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Props {
  onAgree: () => void;
}

export default function SignupTermsModal({ onAgree }: Props) {
  /* 상태 */
  const [agreeRecord, setAgreeRecord] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [openRec, setOpenRec] = useState(false);
  const [openPol, setOpenPol] = useState(false);

  const all = agreeRecord && agreePolicy;
  const toggleAll = (v: boolean) => {
    setAgreeRecord(v);
    setAgreePolicy(v);
  };

  return (
    <div className="absolute inset-0 z-30">
      <div
        className="
          w-full h-full
          rounded-[40px] md:rounded-[30px]          /* 회원가입 박스 radius */
          bg-white
          p-8 md:p-[40px_50px]                     /* 동일 padding */
          overflow-y-auto custom-scroll
          flex flex-col space-y-6 font-[pretendard]"
      >
        {/* 인트로 */}
        <p className="text-center font-bold text-base md:text-lg">
          Takeit 서비스 이용을 위한 <br /> 개인정보 수집 동의
        </p>

        {/* 안내 1 */}
        <section className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between px-4 py-3 font-semibold"
            onClick={() => setOpenRec(!openRec)}
          >
            <span>Takeit 서비스 이용 안내</span>
            <span>{openRec ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence initial={false}>
            {openRec && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 text-sm space-y-1
                           max-h-[8vh] md:max-h-[14vh] overflow-y-auto custom-scroll"
              >
              <p>TakeIT는 모든 사용자가 효율적으로 성장할 수 있도록 설계된 디지털 학습 플랫폼입니다.</p>
              <p>사용자는 로드맵 설계, 실력 진단, 사전·사후 평가, AI 면접, 맞춤형 컨텐츠 추천 등 다양한 기능을 통해 본인만의 학습 경로를 만들어갈 수 있습니다.</p>
              <p>각 기능은 사용자의 목표, 성취도, 학습 이력에 기반해 개인화된 경험을 제공하며, 이를 통해 자기주도적 학습과 실질적인 실력 향상을 지원합니다. </p>
              <p>TakeIT는 사용자의 편의와 성장을 최우선으로 하며, 더 나은 서비스 제공을 위해 지속적으로 기능을 개선해 나가고 있습니다.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 안내 2 */}
        <section className="border rounded-lg">
          <button
            className="w-full flex items-center justify-between px-4 py-3 font-semibold"
            onClick={() => setOpenPol(!openPol)}
          >
            <span>개인정보 수집 안내</span>
            <span>{openPol ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence initial={false}>
            {openPol && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 text-sm space-y-1
                           max-h-[8vh] md:max-h-[14vh] overflow-y-auto custom-scroll"
              >
                <p>TakeIT 서비스 내 이용자 식별, 회원관리 및 서비스 제공을 위해 회원번호와 함께 개인정보를 수집합니다. 해당 정보는 동의 철회 또는 서비스 탈퇴 시 지체없이 파기됩니다. 아래 동의를 거부할 권리가 있으며, 동의를 거부할 경우 서비스 이용이 제한됩니다.</p>
                <p>[수집 목적] <br/> TakeIT 서비스 내 이용자 식별, 회원관리 및 서비스 제공</p>
                <p>[수집 항목] <br/> 이메일 주소, 비밀번호, 서비스 이용 내역</p>
                <p>[보유 기간] <br/> 서비스 종료 또는 서비스 탈퇴 시 지체없이 파기</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 체크 */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agreeRecord}
              onChange={(e) => setAgreeRecord(e.target.checked)}
            />
            <span className="text-sm">Takeit 서비스 이용 안내 (필수)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agreePolicy}
              onChange={(e) => setAgreePolicy(e.target.checked)}
            />
            <span className="text-sm">개인정보 수집 안내 (필수)</span>
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

        {/* 버튼 */}
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
      </div>
    </div>
  );
}
