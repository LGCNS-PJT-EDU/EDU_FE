import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectSpeech } from '@/hooks/useSelectSpeech';
import { getPrivacyStatus, useAuthStore } from '@/store/authGlobal';
import api from '@/api/axios';
import AgreeModal from '@/components/modal/AgreeModal';
import ConfirmModal from '@/components/modal/ConfirmModal';

export default function Selectspeech() {
  /* 상태 */
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);

  /* 과목 필터·선택 */
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'existing' | 'missing'>('existing');

  const navigate = useNavigate();
  const { data, isLoading, error } = useSelectSpeech();

  /* 녹음 개인정보 동의 */
  useEffect(() => {
    if (!getPrivacyStatus()) setShowPrivacyModal(true);
  }, []);

  const handleAgree = async () => {
    try {
      await api.post('/api/interview/privacy');
      useAuthStore.getState().setPrivacyStatus(true);
      setShowPrivacyModal(false);
    } catch (err) {
      console.error(err);
      alert('동의 처리 중 오류가 발생했습니다.');
    }
  };
  const handlePrivacyCancel = () => navigate('/roadmap');

  /* 과목 초기 선택 */
  useEffect(() => {
    if (data) {
      const all = [...data.existingSubjectIds, ...data.missingSubjectIds];
      setSelected(
        new Set(all.filter((s) => s.isComplete).map((s) => s.subjectNm)),
      );
    }
  }, [data]);

  /* 로딩/에러 */
  if (isLoading) return <div className="p-4">불러오는 중...</div>;
  if (error || !data) return <div className="text-red-500 p-4">에러가 발생했습니다.</div>;

  /* util */
  const toggleSubject = (subjectNm: string) =>
    setSelected((prev) => {
      const ns = new Set(prev);
      ns.has(subjectNm) ? ns.delete(subjectNm) : ns.add(subjectNm);
      return ns;
    });

  const subjectList =
    tab === 'existing' ? data.existingSubjectIds : data.missingSubjectIds;
  const filtered = subjectList.filter((s) =>
    s.subjectNm.toLowerCase().includes(filter.toLowerCase()),
  );

  /* 렌더링 */
  return (
    <div className="max-w-4xl mx-auto px-6 pt-5 pb-10 font-[pretendard]">
      {/* 안내 배너 */}
      <div className="text-sm text-[#779AF4] px-2 py-2 bg-blue-100 border border-blue-200 rounded-md p-3s mb-5">
        * 면접 볼 과목을 선택해주세요! <br/>* 선택한 과목은 파란색으로 표시되며, 사후평가를 완료한 과목은 기본 선택 상태입니다.
      </div>

      {/* 탭 */}
      <div className="flex mb-6 border-b border-gray-200">
        {(['existing', 'missing'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`mr-4 pb-2 border-b-2 ${
              tab === t
                ? 'border-[#6378EB] text-[#6378EB] font-bold'
                : 'border-transparent text-gray-500'
            }`}
          >
            {t === 'existing' ? '로드맵 과목' : '전체 과목'}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="과목 검색..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
      />

      {/* 과목 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {filtered.map((s) => {
          const isSelected = selected.has(s.subjectNm);
          return (
            <div
              key={s.subId}
              onClick={() => toggleSubject(s.subjectNm)}
              className={`relative w-full h-16 sm:h-20 flex items-center justify-center px-4 text-center rounded-lg font-bold border-2 cursor-pointer transition
                ${
                  isSelected
                    ? 'border-[#6378EB] bg-blue-50 text-[#6378EB]'
                    : 'border-gray-300 bg-white text-gray-800'
                }`}
            >
              {s.isComplete && (
                <div className="absolute top-1 left-1 bg-[#73ccdc] text-white text-[12px] px-2 py-[2px] rounded-[7px] font-semibold z-10">
                  평가완료
                </div>
              )}
              <span className="text-sm leading-tight break-words">
                {s.subjectNm}
              </span>
            </div>
          );
        })}
      </div>

      {/* 제출 버튼 */}
      {selected.size > 0 && (
        <div className="mt-10 text-center">
          <button
            className="px-6 py-3 w-full bg-[#779AF4] text-white rounded-md hover:bg-[#6378EB] transition"
            onClick={() => setShowStartModal(true)}
          >
            면접 보러가기
          </button>
        </div>
      )}

      {/* ───────── 모달들 ───────── */}
      {showPrivacyModal && (
        <AgreeModal onAgree={handleAgree} onClose={handlePrivacyCancel} />
      )}

      {showStartModal && (
        <ConfirmModal
          title="Takeit 면접을 시작합니다."
          message={
            '시작 버튼을 누르시면 문제가 음성으로 출력되고<br/>15초 뒤 자동으로 음성 녹음이 시작됩니다.<br/>문제는 다섯 문제가 출제되며 한 문제 이상<br/> 응답 후 제출이 가능합니다.'
          }
          confirmText="시작"
          onClose={() => setShowStartModal(false)}
          onConfirm={() => {
            const all = [...data.existingSubjectIds, ...data.missingSubjectIds];
            const ids = all
              .filter((s) => selected.has(s.subjectNm))
              .map((s) => s.subId);

            navigate('/testspeech', { state: { subjectIds: ids } });
          }}
        />
      )}
    </div>
  );
}
