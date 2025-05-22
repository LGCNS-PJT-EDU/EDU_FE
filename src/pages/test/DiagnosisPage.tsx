import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { isLoggedIn } from '@/store/authGlobal';
import DiagnosisTemplate from '@/pages/diagnosis/DiagnosisTemplate';

interface Choice {
  choiceId: number;
  choiceNum: number;
  choice: string;
  value: string;
}
interface Question {
  diagnosisId: number;
  question: string;
  questionType: string;
  choices: Choice[];
}
interface RawData {
  COMMON: Question[];
  BE: Question[];
  FE: Question[];
}
interface RoadmapData {
  subjects: any[];
  uuid?: string;
}

export default function DiagnosisPage() {
  const [raw, setRaw] = useState<RawData | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/diagnosis')
      .then((res) => setRaw(res.data as RawData))
      .catch(() => {
        alert('문제를 불러오지 못했습니다.');
      });
  }, []);

  const track = answers[1]; // 진로 선택값 (BE/FE)
  const questions: Question[] = useMemo(() => {
    if (!raw) return [];
    const common = raw.COMMON ?? [];
    const be = raw.BE ?? [];
    const fe = raw.FE ?? [];
    if (track === 'BE') return [...common, ...be];
    if (track === 'FE') return [...common, ...fe];
    return common;
  }, [raw, track]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const payload = Object.entries(answers).map(([id, val]) => ({
      questionId: Number(id),
      answer: val,
    }));

    try {
      const { data } = await api.post<RoadmapData>('/api/diagnosis', payload);
      if (!isLoggedIn() && data.uuid) {
        localStorage.setItem('roadmapUuid', data.uuid);
      }
      navigate('/roadmap', { state: data });
    } finally {
      setSubmitting(false);
    }
  };

  if (!raw) return <div className="text-center mt-10">문제 불러오는 중...</div>;

  return (
    <DiagnosisTemplate
      questions={questions}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      answers={answers}
      setAnswers={setAnswers}
      onSubmit={handleSubmit}
      submitting={submitting}
      hasStarted={hasStarted}
      setHasStarted={setHasStarted}
    />
  );
}
