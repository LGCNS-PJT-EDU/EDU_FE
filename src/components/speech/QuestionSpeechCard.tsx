import React, { useState, useEffect, useRef } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import blackMic from '@/asset/img/speech/blackMic.png';
import redMic from '@/asset/img/speech/redMic.png';

interface Props {
  question: {
    interviewId: number;
    interviewContent: string;
  };
  isAnswered: boolean;
  onTranscriptComplete: (
    interviewId: number,
    transcript: string,
    isFinal: boolean
  ) => void;
}

const PREP_COUNTDOWN_SEC = 10;
const MAX_RECORD_SEC = 60;

const QuestionSpeechCard: React.FC<Props> = ({ question, isAnswered, onTranscriptComplete }) => {
  const {
    transcript,
    listening,
    startListening,
    stopRecording,
    speakWithCallback,
    resetTranscript,
    resetAudioBlob,
    audioBlob,
  } = useSpeech();

  const [phase, setPhase] = useState<'reading' | 'preparing' | 'recording' | 'done'>('reading');
  const [prepCountdown, setPrepCountdown] = useState(PREP_COUNTDOWN_SEC);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [localTranscript, setLocalTranscript] = useState('');
  const phaseRef = useRef(phase);
  const recordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { phaseRef.current = phase }, [phase]);

  useEffect(() => {
    if (isAnswered) {
      stopRecording();
      setPhase('done');
      clearTimeout(recordTimeoutRef.current!);
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
          if (phaseRef.current !== 'recording') {
            beginRecording();
          }
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
    recordTimeoutRef.current = setTimeout(() => handleStopRecording(), MAX_RECORD_SEC * 1000);
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
    stopRecording();
    clearTimeout(recordTimeoutRef.current!);
    setPhase('done');
    onTranscriptComplete(question.interviewId, transcript, true);
  };

  const handleMicClick = () => {
    if (phase === 'preparing') beginRecording();
    else if (phase === 'recording') handleStopRecording();
  };

  const handleDownload = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_${question.interviewId}.webm`;
    a.click();
  };

  const formatTime = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  return (
    <div className="border border-[#dbe2ef] rounded-xl px-5 py-6 shadow-sm font-[Pretendard]">
      <h3 className="text-base font-bold text-gray-800 mb-4">Q. {question.interviewContent}</h3>
      <div className="flex justify-center mb-4">
        <button
          onClick={handleMicClick}
          disabled={phase === 'done' || phase === 'reading'}
          className="focus:outline-none disabled:cursor-not-allowed"
        >
          <img
            src={phase === 'recording' ? redMic : blackMic}
            alt="mic"
            className="w-18 h-18 md:w-20 md:h-20 select-none"
          />
        </button>
      </div>

      <div className="text-center mb-4">
        {phase === 'reading' && <p className="text-sm text-gray-500">문제 출력 중</p>}
        {phase === 'preparing' && <p className="text-sm text-gray-500">답변 준비 중{prepCountdown}</p>}
        {phase === 'recording' && <p className="text-sm text-red-600">녹음 중{formatTime(recordSeconds)}</p>}
        {phase === 'done' && <p className="text-sm text-[#6378eb]">녹음 완료! 다음으로 이동하세요.</p>}
      </div>

      {phase === 'done' && audioBlob && (
        <>
          <div className="flex justify-center mb-2">
            <audio controls src={URL.createObjectURL(audioBlob)} />
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-md bg-[#92d6de] text-white text-sm font-semibold hover:bg-[#73ccd7]"
            >
              ⬇ 녹음 파일 다운로드
            </button>
          </div>
        </>
      )}

      <div className="mt-6 bg-[#f4f6fb] border border-dashed border-[#b7c2dc] rounded-xl px-4 py-3 text-sm text-gray-800 flex gap-2 items-start min-h-[60px]">
        <span className="text-lg">🗣️</span>
        <div className="flex-1 overflow-y-auto">
          {localTranscript || <span className="text-gray-400">음성 인식 결과가 여기에 표시됩니다.</span>}
        </div>
      </div>
    </div>
  );
};

export default QuestionSpeechCard;
