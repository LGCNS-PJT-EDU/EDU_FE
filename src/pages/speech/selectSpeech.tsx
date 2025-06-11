import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectSpeech } from '@/hooks/useSelectSpeech';

export default function Selectspeech() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSelectSpeech();

  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'existing' | 'missing'>('existing');

  useEffect(() => {
    if (data) {
      const allSubjects = [...data.existingSubjectIds, ...data.missingSubjectIds];
      const initiallySelected = new Set(
        allSubjects.filter(s => s.isComplete).map(s => s.subjectNm)
      );
      setSelected(initiallySelected);
    }
  }, [data]);

  if (isLoading) return <div className="p-4">불러오는 중...</div>;
  if (error || !data) return <div className="text-red-500 p-4">에러가 발생했습니다.</div>;

  const toggleSubject = (subjectNm: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectNm)) newSet.delete(subjectNm);
      else newSet.add(subjectNm);
      return newSet;
    });
  };

  const subjectList =
    tab === 'existing' ? data.existingSubjectIds : data.missingSubjectIds;

  const filteredSubjects = subjectList.filter(subject =>
    subject.subjectNm.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 pt-5 pb-10 font-[pretendard]">
      <div className="text-sm text-[#779AF4] bg-blue-100 border border-blue-200 rounded-md p-3 mb-5">
        * 사전평가를 완료한 과목은 파란색으로 표시되며, 기본 선택 상태입니다.
      </div>
      {/* 탭 */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('existing')}
          className={`mr-4 pb-2 border-b-2 ${tab === 'existing'
            ? 'border-[#6378EB] text-[#6378EB] font-bold'
            : 'border-transparent text-gray-500'
            }`}
        >
          로드맵 과목
        </button>
        <button
          onClick={() => setTab('missing')}
          className={`pb-2 border-b-2 ${tab === 'missing'
            ? 'border-[#6378EB] text-[#6378EB] font-bold'
            : 'border-transparent text-gray-500'
            }`}
        >
          전체 과목
        </button>
      </div>

      {/* 검색 */}
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="과목 검색..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
      />

      {/* 과목 카드 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {filteredSubjects.map(subject => {
          const isSelected = selected.has(subject.subjectNm);

          return (
            <div
              key={subject.subId}
              onClick={() => toggleSubject(subject.subjectNm)}
              className={`relative w-full h-16 sm:h-20 flex items-center justify-center px-4 text-center rounded-lg font-bold border-2 cursor-pointer transition
                  ${isSelected
                  ? 'border-[#6378EB] bg-blue-50 text-[#6378EB]'
                  : 'border-gray-300 bg-white text-gray-800'
                }`}

            >
              {subject.isComplete && (
                <div className="absolute top-1 left-1 bg-[#73ccdc] text-white text-[12px] px-2 py-[2px] rounded-[7px] font-semibold z-10">
                  완료
                </div>
              )}
              <span className="text-sm leading-tight text-center break-words">
                {subject.subjectNm}
              </span>
            </div>
          );
        })}
      </div>

      {/* 제출 */}
      {selected.size > 0 && (
        <div className="mt-10 text-center">
          <button
            className="px-6 py-3 w-full bg-[#779AF4] text-white rounded-md hover:bg-[#6378EB] transition"
            onClick={() => {
              const allSubjects = [...data.existingSubjectIds, ...data.missingSubjectIds];
              const selectedSubjectIds = allSubjects
                .filter(subject => selected.has(subject.subjectNm))
                .map(subject => subject.subId);

              navigate('/testspeech', {
                state: { subjectIds: selectedSubjectIds },
              });
            }}
          >
            면접 보러가기
          </button>
        </div>
      )}
    </div>
  );
}
