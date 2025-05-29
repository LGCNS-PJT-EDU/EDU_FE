import React, { useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';

const TestSpeech: React.FC = () => {
  const { transcript, listening, startListening, speak, resetTranscript } = useSpeech();
  const [inputText, setInputText] = useState('');

  return (
    <div className="min-h-screen bg-blue-50 p-10 font-sans text-gray-800">
      <h2 className="text-3xl font-bold text-blue-600 mb-10"> TTS / STT 테스트 페이지</h2>

      <section className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-blue-500 mb-4"> 음성 인식 (STT)</h3>
        <button
          onClick={startListening}
          disabled={listening}
          className={`px-4 py-2 mr-3 rounded-md font-semibold text-white ${listening ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {listening ? '듣는 중...' : ' 인식 시작'}
        </button>
        <p className="italic mt-4 mb-4">결과: {transcript || '없음'}</p>
        <button
          onClick={() => speak(transcript)}
          className="px-4 py-2 mr-3 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600"
        >
          읽어주기
        </button>
        <button
          onClick={resetTranscript}
          className="px-4 py-2 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600"
        >
           결과 지우기
        </button>
      </section>

      <section className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-500 mb-4"> 텍스트 음성 출력 (TTS)</h3>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="읽을 텍스트를 입력하세요"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={() => speak(inputText)}
          className="px-4 py-2 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600"
        >
           읽기
        </button>
      </section>
    </div>
  );
};

export default TestSpeech;