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
  isAnswered: boolean;
  onTranscriptComplete: (
    interviewId: number,
    text: string,
    isFinal: boolean,
  ) => void;
}

const PREP_COUNTDOWN_SEC = 15;
const MAX_RECORD_SEC = 60;
const CARD_RATIO = 1.618;

const QuestionSpeechCard: React.FC<Props> = ({
  question,
  onTranscriptComplete,
  isAnswered,
}) => {
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

  type Phase = 'reading' | 'preparing' | 'recording' | 'done';

  const [phase, setPhase] = useState<Phase>('reading');
  const [prepCountdown, setPrepCountdown] = useState(PREP_COUNTDOWN_SEC);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [localTranscript, setLocalTranscript] = useState('');

  const recordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAnswered) {
      stopRecording();
      setPhase('done');
      clearTimeout(recordTimeoutRef.current as NodeJS.Timeout);
      return;
    }

    setPhase('reading');
    const timer = setTimeout(() => {
      speakWithCallback(question.interviewContent, () => {
        setPhase('preparing');
        startPrepCountdown();
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      stopRecording();
    };
  }, [question.interviewId, isAnswered]);

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

  const beginRecording = () => {
    resetTranscript();
    resetAudioBlob();
    setLocalTranscript('');
    setRecordSeconds(0);
    setPhase('recording');
    startListening();

    recordTimeoutRef.current = setTimeout(() => {
      handleStopRecording();
    }, MAX_RECORD_SEC * 1000);
  };

  useEffect(() => {
    if (phase !== 'recording') return;
    const interval = setInterval(() => {
      setRecordSeconds((sec) => sec + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (transcript) {
      setLocalTranscript(transcript);
      onTranscriptComplete(question.interviewId, transcript, false);
    }
  }, [transcript]);

  const handleStopRecording = () => {
    if (phase !== 'recording') return;
    stopRecording();
    clearTimeout(recordTimeoutRef.current as NodeJS.Timeout);
    setPhase('done');
    onTranscriptComplete(question.interviewId, transcript, true);
  };

  const handleMicClick = () => {
    if (phase === 'preparing') {
      beginRecording();
    } else if (phase === 'recording') {
      handleStopRecording();
    }
  };

  const handleDownload = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_${question.interviewId}.webm`;
    a.click();
  };

  const formatTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  return (
    <section
      className="border border-cyan-300 rounded-xl p-6 bg-white shadow-sm mx-auto flex flex-col justify-between"
      style={{
        width: '100%',
        maxWidth: 800,
        height: 'auto',
        aspectRatio: `${CARD_RATIO} / 1`,
      }}
    >
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-4">
        Q. {question.interviewContent}
      </h3>

      <div className="flex justify-center mb-4">
        <button
          onClick={handleMicClick}
          disabled={phase === 'done' || phase === 'reading'}
          className="focus:outline-none disabled:cursor-not-allowed"
        >
          <img
            src={phase === 'recording' ? redMic : blackMic}
            alt="mic"
            className="w-24 h-24 md:w-28 md:h-28 select-none"
          />
        </button>
      </div>

      <div className="text-center mt-2 mb-4">
        {phase === 'reading' && <p className="text-sm text-gray-500">문제 출력 중…</p>}
        {phase === 'preparing' && (
          <>
            <p className="text-sm text-gray-500">답변을 준비해주세요</p>
            <p className="text-xl font-mono text-cyan-700">{prepCountdown}</p>
          </>
        )}
        {phase === 'recording' && (
          <>
            <p className="text-sm text-red-600">녹음 중… (최대 1분)</p>
            <p className="text-xl font-mono text-red-600">{formatTime(recordSeconds)}</p>
          </>
        )}
        {phase === 'done' && (
          <p className="text-sm text-green-600">녹음이 종료되었습니다. 다음 문제로 넘어가 주세요.</p>
        )}
      </div>

      {phase === 'done' && audioBlob && (
        <>
          <div className="flex justify-center mb-2">
            <audio controls src={URL.createObjectURL(audioBlob)} />
          </div>

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

      <div className="bg-gray-100 text-sm text-gray-800 p-4 rounded-md min-h-[60px] h-[60px] overflow-y-auto">
        {localTranscript || <span className="text-gray-400">음성 인식 결과가 여기에 표시됩니다.</span>}
      </div>
    </section>
  );
};

export default QuestionSpeechCard;
