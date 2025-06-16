import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { submitInterviewAnswers } from '@/api/interviewService';
import QuestionSpeechCard from '@/components/speech/QuestionSpeechCard';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/modal/ConfirmModal';
import blackMic from '@/asset/img/speech/blackMic.png';

interface InterviewQuestion {
  interviewId: number;
  interviewContent: string;
  subjectId: number;
  subjectName: string;
  nth: number;
}

const NAV_HEIGHT_PX = 72;

const TestSpeech: React.FC = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nth, setNth] = useState<number | null>(null);
  const [subjectIds, setSubjectIds] = useState<number[]>([]);
  const [answers, setAnswers] = useState<{ [interviewId: number]: string }>({});

  const [showConfirm, setShowConfirm] = useState(false);
  const [firstRecordingDone, setFirstRecordingDone] = useState(false); // 1번 문제 녹음 완료 여부
  const [recordingDoneMap, setRecordingDoneMap] = useState<{ [interviewId: number]: boolean }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const subjectIdsFromState =
    (location.state as { subjectIds: number[] })?.subjectIds ?? [];

  /* 질문 목록 조회 */
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await api.get<{ data: InterviewQuestion[] }>(
          '/api/interview/list',
          { params: { subjectIds: subjectIdsFromState } },
        );

        setQuestions(res.data.data);
        if (res.data.data.length > 0) setNth(res.data.data[0].nth);
      } catch (error) {
        console.error('질문 목록 불러오기 실패:', error);
      }
    }

    if (subjectIdsFromState.length > 0) {
      fetchQuestions();
      setSubjectIds(subjectIdsFromState);
    }
  }, [subjectIdsFromState]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  /* 제출 */
  const handleSubmitClick = () => setShowConfirm(true);

  const handleConfirmSubmit = async () => {
    if (!nth) return;

    const payload = Object.entries(answers).map(([interviewId, userReply]) => {
      const q = questions.find((qq) => qq.interviewId === Number(interviewId));
      return {
        interviewId: Number(interviewId),
        interviewContent: q?.interviewContent ?? '',
        userReply,
      };
    });

    try {
      await submitInterviewAnswers({ answers: payload, nth });
      navigate(`/speechfeedback?nth=${nth}`, { replace: true });
    } catch (e) {
      console.error('제출 실패:', e);
      alert('제출 실패');
    } finally {
      setShowConfirm(false);
    }
  };

  /* 렌더링 */
  const currentQuestion = questions[currentIndex];

  return (
    <div
      className="min-h-screen bg-blue-50 py-10 px-2"
      style={{ paddingTop: NAV_HEIGHT_PX }} /* nav 높이만큼 내리기 */
    >
      <div className="w-full max-w-4xl mx-auto px-1">
        {/* 헤더 */}
        <header className="flex justify-between items-center mb-4">
          {currentQuestion && (
            <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.subjectName}</h2>
          )}
          <span className="text-base font-semibold text-cyan-700 bg-cyan-100 px-2 py-1 rounded-md shadow-sm">
            {questions.length > 0
              ? `문제 ${currentIndex + 1} / ${questions.length}`
              : ''}
          </span>
        </header>

        {/* 질문 카드 */}
        {currentQuestion && (
          <QuestionSpeechCard
            key={currentQuestion.interviewId}
            question={currentQuestion}
            onTranscriptComplete={(interviewId, text, isFinal) => {
              setAnswers((prev) => ({ ...prev, [interviewId]: text }));
              /* 1번 문제 녹음 완료 → 제출 버튼 활성화 */
             if(isFinal){
              setRecordingDoneMap((prev)=> ({ ...prev, [interviewId]: true }));

              if(interviewId === currentQuestion.interviewId) {
                setFirstRecordingDone(true);
              }
             }
            }}
          />
        )}

        {/* 이전/다음 버튼 */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2 rounded-md border font-semibold text-sm transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed
                       bg-white text-cyan-600 border-cyan-400 hover:bg-cyan-50"
          >
            ⬅ 이전
          </button>
          <button
          onClick={handleNext}
          disabled={
            currentIndex === questions.length - 1 ||
            !recordingDoneMap[questions[currentIndex]?.interviewId] // 녹음 안 끝났으면 비활성화
          }
          className="px-5 py-2 rounded-md border font-semibold text-sm transition-colors
                    disabled:opacity-40 disabled:cursor-not-allowed
                    bg-white text-cyan-600 border-cyan-400 hover:bg-cyan-50"
        >
          다음 ➡
            </button>

        </div>

        {/* 제출 버튼 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmitClick}
            disabled={!firstRecordingDone}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {firstRecordingDone ? '면접 제출하기' : '녹음 완료 후 제출 가능'}
          </button>
        </div>

        {/* 제출 확인 모달 */}
        {showConfirm && (
          <ConfirmModal
            title="정말 제출하시겠습니까?"
            message="제출 후 AI 피드백 생성까지 약 1분 소요됩니다."
            confirmText="제출"
            onConfirm={handleConfirmSubmit}
            onClose={() => setShowConfirm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TestSpeech;
