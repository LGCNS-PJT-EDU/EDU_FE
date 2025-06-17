import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { submitInterviewAnswers } from '@/api/interviewService';
import QuestionSpeechCard from '@/components/speech/QuestionSpeechCard';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/modal/ConfirmModal';

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
  const [firstRecordingDone, setFirstRecordingDone] = useState(false);
  const [recordingDoneMap, setRecordingDoneMap] = useState<{ [interviewId: number]: boolean }>({});
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const subjectIdsFromState = (location.state as { subjectIds: number[] })?.subjectIds ?? [];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await api.get<{ data: InterviewQuestion[] }>('/api/interview/list', {
          params: { subjectIds: subjectIdsFromState },
        });

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

  const handleSubmitClick = () => setShowConfirm(true);

  const handleConfirmSubmit = async () => {
    if (!nth) return;

    const payload = Object.entries(answers).map(([interviewId, userReply]) => {
      const q = questions.find((qq) => qq?.interviewId === Number(interviewId));
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

  const handleMicClick = () => {
    if (timer) clearInterval(timer);
    setTimeLeft(5);
    const newTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(newTimer);
          setTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="py-10 px-4" style={{ paddingTop: NAV_HEIGHT_PX }}>
      <div className="max-w-xl mx-auto bg-white border border-[#dbe2ef] rounded-2xl p-6 font-[Pretendard]">
        {currentQuestion && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#1f2d40] flex items-center">
                <span className="text-[13px] mr-2 font-semibold bg-indigo-100 text-[#6378eb] rounded-md flex items-center justify-center shadow-inner px-2 py-2">과목명</span>
                {currentQuestion.subjectName}</h2>
              <span className="text-[13px] font-semibold bg-indigo-100 text-[#6378eb] rounded-md flex items-center justify-center shadow-inner px-2 py-2">
                문제 {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <QuestionSpeechCard
              key={currentQuestion.interviewId}
              question={currentQuestion}
              isAnswered={!!recordingDoneMap[currentQuestion.interviewId]}
              onTranscriptComplete={(interviewId, text, isFinal) => {
                setAnswers((prev) => ({ ...prev, [interviewId]: text }));
                if (isFinal) {
                  setRecordingDoneMap((prev) => ({ ...prev, [interviewId]: true }));
                  if (interviewId === questions[0]?.interviewId) {
                    setFirstRecordingDone(true);
                  }
                }
              }}
            />

            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 rounded-[8px] bg-[#D7DBFF] px-6 py-3 text-[#6378EB]"
              >
                ⬅ 이전
              </button>
              <button
                onClick={handleNext}
                disabled={
                  currentIndex === questions.length - 1 ||
                  !recordingDoneMap[questions[currentIndex]?.interviewId]
                }
                className="pflex items-center gap-1 rounded-[8px] bg-[#6378EB] px-6 py-3 text-white"
              >
                다음 ➡
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSubmitClick}
                disabled={!firstRecordingDone}
                className="w-full py-3 bg-[#779AF4] text-white rounded-md hover:bg-[#6378EB] transition"
              >
                {firstRecordingDone ? '면접 제출하기' : '녹음 완료 후 제출 가능'}
              </button>
            </div>
          </>
        )}

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
