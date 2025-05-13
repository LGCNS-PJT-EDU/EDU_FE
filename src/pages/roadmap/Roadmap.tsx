// src/components/Roadmap.jsx
import { useEffect, useState } from 'react';
import SubjectModal from '@/pages/roadmap/Subject';
import api from '@/api/axios';
import '@/styled/pages/roadmap.css';

interface Answer {
  questionId: number;
  answer: string;
}

interface Subject {
  subjectId: number;
  subjectName: string;
}

interface RoadmapData {
  subjects: Subject[];
}

/* 1) 설문 응답 mock 나중에 지울 예정 -------------------------------------- */
const answers: Answer[] = [
  { questionId: 1, answer: 'BE' },
  { questionId: 2, answer: '2' },
  { questionId: 3, answer: '3' },
  { questionId: 4, answer: 'Y' },
  { questionId: 11, answer: 'Java/Spring' },
  { questionId: 12, answer: 'Y' },
  { questionId: 13, answer: 'Y' },
  { questionId: 14, answer: 'Y' },
  { questionId: 15, answer: 'N' },
];

/* 2) 로드맵 요청 함수 -------------------------------------------------- */
async function requestRoadmap(body: Answer[]): Promise<RoadmapData> {
  const res = await api.post<RoadmapData>('/api/diagnosis', body);
  return res.data;
}

/* 3) 컴포넌트 ---------------------------------------------------------- */
export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [selected, setSelected] = useState<Subject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  /* 3‑1) 마운트 → 로드맵 요청 */
  useEffect(() => {
    (async () => {
      try {
        const data = await requestRoadmap(answers);
        if (!data?.subjects?.length) {
          console.warn('subjects 배열이 비어 있습니다.');
        }
        setRoadmap(data);
      } catch (e) {
        console.error(e);
        setError('로드맵을 불러오지 못했습니다.');
      }
    })();
  }, []);

  /* 3‑2) 모달 열기 */
  const openModal = (subject: Subject) => {
    setSelected(subject);
    setIsModalOpen(true);
  };

  /* 4) 렌더링 ---------------------------------------------------------- */
  const subjects = roadmap?.subjects ?? [];

  return (
    <section id="roadmap">
      <div className="container">
        {/* 헤더 */}
        <header className="header">
          <h1>맞춤 로드맵</h1>
        </header>

        {/* 에러 표시 */}
        {error && <p className="error-msg">{error}</p>}

        {/* subjects 존재하면 로드맵 그려주기 */}
        {subjects?.length > 0 && (
          <section className="visual">
            <div className="line" />

            <ul className="list">
              {subjects.map((s) => (
                <li key={s.subjectId} className="node">
                  <button className="btn-subject" onClick={() => openModal(s)}>
                    {s.subjectName}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 모달 */}
        {isModalOpen && selected && (
          <SubjectModal subject={selected} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </section>
  );
}
