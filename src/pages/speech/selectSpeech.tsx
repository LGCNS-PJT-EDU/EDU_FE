import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectSpeech } from '@/hooks/useSelectSpeech';

export default function Selectspeech() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSelectSpeech();

  const [filter, setFilter] = useState('');
  const [customSubject, setCustomSubject] = useState('');

  if (isLoading) return <div className="p-4">불러오는 중...</div>;
  if (error || !data) return <div className="text-red-500 p-4">에러가 발생했습니다.</div>;

  const { existingSubjectIds, missingSubjectIds } = data;

  const allSubjects = [...existingSubjectIds, ...missingSubjectIds];
  const selected = new Set(existingSubjectIds.map(s => s.subjectNm));

  const handleAddSubject = () => {
    const trimmed = customSubject.trim();
    if (!trimmed) return;
    if (allSubjects.some(s => s.subjectNm === trimmed)) {
      alert('이미 존재하는 과목입니다.');
      return;
    }
    // UI 상에서만 임시 추가
    allSubjects.push({ subId: Date.now(), subjectNm: trimmed });
    selected.add(trimmed);
    setCustomSubject('');
  };

  const filteredSubjects = allSubjects.filter(subject =>
    subject.subjectNm.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-[pretendard]">
      <h1 className="text-3xl font-bold mb-6">과목을 선택해 주세요</h1>

      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="과목 검색..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
      />

      <div className="flex flex-wrap gap-4 mb-6">
        {filteredSubjects.map(subject => (
          <div
            key={subject.subId}
            className={`w-23 h-10 flex items-center justify-center rounded-lg shadow-md font-[13px] border-2 transition
              ${selected.has(subject.subjectNm)
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-300 bg-white text-gray-800'}`}
          >
            {subject.subjectNm}
          </div>
        ))}
      </div>

      <div className="text-sm text-blue-800 bg-blue-100 border border-blue-200 rounded-md p-3 mb-10">
        * 이미 선택된 과목은 파란색으로 표시됩니다.
      </div>

      <div className="bg-white rounded-lg border-1 p-6">
        <h3 className="text-lg font-semibold mb-4">로드맵에 없는 과목 추가</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={customSubject}
            onChange={e => setCustomSubject(e.target.value)}
            placeholder="추가할 과목명 입력"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddSubject}
            className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            추가하기
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mt-10 text-center">
          <button
            className="px-6 py-3 w-full bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            onClick={() => navigate("/testspeech")}
          >
            면접 보러가기
          </button>
        </div>
      )}
    </div>
  );
}
