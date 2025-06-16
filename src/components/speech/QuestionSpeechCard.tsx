import React, { useState, useEffect, useRef } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import blackMic from '@/asset/img/speech/blackMic.png';
import redMic from '@/asset/img/speech/redMic.png';

interface Props {
  question: {
    interviewId: number;
    interviewContent: string;
    subjectId: number;
    nth: number;
  };
  /* onTranscriptComplete
     - text: 실시간/최종 텍스트
     - isFinal: 이번 질문 녹음이 최종 종료되었을 때 true
  */
  onTranscriptComplete: (
    interviewId: number,
    text: string,
    isFinal: boolean,
  ) => void;
}

/* 상수 */
const PREP_COUNTDOWN_SEC = 15;
const MAX_RECORD_SEC = 60;
const CARD_RATIO = 1.618; // 가로:세로 (약 800 x 495)

const QuestionSpeechCard: React.FC<Props> = ({
  question,
  onTranscriptComplete,
}) => {
  /* 음성 훅 */
  const {
    transcript,
    listening,
    startListening,
    stopRecording,
    speak,
    speakWithCallback,
    resetTranscript,
    resetAudioBlob,
    audioBlob,
  } = useSpeech();

  /* 상태 */
  type Phase = 'reading' | 'preparing' | 'recording' | 'done';

  const [phase, setPhase] = useState<Phase>('reading');
  const [prepCountdown, setPrepCountdown] = useState(PREP_COUNTDOWN_SEC);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [localTranscript, setLocalTranscript] = useState('');

  const recordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* TTS 질문 읽기 */
  useEffect(() => {
    setPhase('reading');
    const timer = setTimeout(() => {
      speakWithCallback(question.interviewContent, () => {
        /* 질문 읽기 종료 → 준비 단계 진입 */
        setPhase('preparing');
        startPrepCountdown();
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [question.interviewId]);

  /* --------------------------------------------------
     1) 준비 카운트다운
     2) 준비 중에도 사용자가 검정 마이크 누르면 바로 startRecording
  -------------------------------------------------- */
  const startPrepCountdown = () => {
    setPrepCountdown(PREP_COUNTDOWN_SEC);
    const id = setInterval(() => {
      setPrepCountdown((p) => {
        if (p <= 1) {
          clearInterval(id);
          beginRecording();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
  };

  /* 녹음 시작 */
  const beginRecording = () => {
    resetTranscript();
    resetAudioBlob();
    setLocalTranscript('');
    setRecordSeconds(0);
    setPhase('recording');
    startListening();

    /* 60초 자동 종료 타이머 */
    recordTimeoutRef.current = setTimeout(() => {
      if (listening) handleStopRecording();
    }, MAX_RECORD_SEC * 1000);
  };

  /* 녹음 진행 타이머 */
  useEffect(() => {
    if (phase !== 'recording') return;
    const interval = setInterval(
      () => setRecordSeconds((sec) => sec + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [phase]);

  /* 실시간 결과 전달 */
  useEffect(() => {
    if (transcript) {
      setLocalTranscript(transcript);
      onTranscriptComplete(question.interviewId, transcript, false);
    }
  }, [transcript]);

  /* 질문 변경 초기화 */
  useEffect(() => {
    stopRecording(); // 혹시 녹음 중이었다면
    clearTimeout(recordTimeoutRef.current as NodeJS.Timeout);
    resetTranscript();
    resetAudioBlob();
    setLocalTranscript('');
    setRecordSeconds(0);
    setPrepCountdown(PREP_COUNTDOWN_SEC);
  }, [question.interviewId]);

  /* 녹음 종료 */
  const handleStopRecording = () => {
    if (!listening) return;
    stopRecording();
    clearTimeout(recordTimeoutRef.current as NodeJS.Timeout);
    setPhase('done');
    onTranscriptComplete(question.interviewId, transcript, true);
  };

  /* 마이크 버튼 클릭 */
  const handleMicClick = () => {
    if (phase === 'preparing') {
      /* 준비 중 → 조기 시작 */
      beginRecording();
    } else if (phase === 'recording') {
      /* 녹음 중 → 중단 */
      handleStopRecording();
    }
  };

  /* 다운로드 */
  const handleDownload = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_${question.interviewId}.webm`;
    a.click();
  };

  /* util */
  const formatTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(
      sec % 60,
    ).padStart(2, '0')}`;

  /* 렌더링 */
  return (
    <section
      className="border border-cyan-300 rounded-xl p-6 bg-white shadow-sm
                 mx-auto flex flex-col justify-between"
      style={{
        width: '100%',
        maxWidth: 800,
        height: 'auto',
        aspectRatio: `${CARD_RATIO} / 1`,
      }}
    >
      {/* 질문 텍스트 */}
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-4">
        Q. {question.interviewContent}
      </h3>

      {/* 마이크 버튼 */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleMicClick}
          disabled={phase === 'done' || phase === 'reading'}
          className="focus:outline-none disabled:cursor-not-allowed"
        >
          <img
            src={
              phase === 'recording' ? redMic : blackMic
            }
            alt="mic"
            className="w-24 h-24 md:w-28 md:h-28 select-none"
          />
        </button>
      </div>

      {/* 상태 & 타이머 */}
      <div className="text-center mt-2 mb-4">
        {phase === 'reading' && (
          <p className="text-sm text-gray-500">문제 출력 중…</p>
        )}
        {phase === 'preparing' && (
          <>
            <p className="text-sm text-gray-500">답변을 준비해주세요</p>
            <p className="text-xl font-mono text-cyan-700">
              {prepCountdown}
            </p>
          </>
        )}
        {phase === 'recording' && (
          <>
            <p className="text-sm text-red-600">녹음 중… (최대 1분)</p>
            <p className="text-xl font-mono text-red-600">
              {formatTime(recordSeconds)}
            </p>
          </>
        )}
        {phase === 'done' && (
          <p className="text-sm text-green-600">
            녹음이 종료되었습니다. 다음 문제로 넘어가 주세요.
          </p>
        )}
      </div>

      {phase === 'done' && audioBlob && (
  <>
    {/*  녹음 재생기 */}
    <div className="flex justify-center mb-2">
      <audio controls src={URL.createObjectURL(audioBlob)} />
    </div>

    {/* 다운로드 버튼 */}
    <div className="flex justify-center mb-4">
      <button
        onClick={handleDownload}
        className="px-4 py-2 rounded-md bg-green-500 text-white text-sm font-semibold hover:bg-green-600"
      >
        ⬇ 녹음 파일 다운로드
      </button>
    </div>
  </>
)}

      {/* 음성 인식 결과 영역 */}
      <div className="bg-gray-100 text-sm text-gray-800 p-4 rounded-md
                      min-h-[60px] h-[60px] overflow-y-auto">
        {localTranscript || (
          <span className="text-gray-400">음성 인식 결과가 여기에 표시됩니다.</span>
        )}
      </div>
    </section>
  );
};

export default QuestionSpeechCard;