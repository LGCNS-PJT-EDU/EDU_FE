export {};

declare global {
  // 브라우저 window 객체에 webkitSpeechRecognition과 SpeechRecognition을 타입스크립트가 인식하도록 추가
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }

  type SpeechRecognition = any;

  // SpeechRecognition 관련 타입 정의
  // 음성 인식 결과 모음 (문장 + 정확도)
  interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    transcript: string; // 사용자가 말한 문장
    confidence: number; // 정확도(신뢰도)
  }

  // 음성 인식 이벤트 타입 정의
  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }

  // 여러 문장 말했을 때 전체 리스트
  interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
  }
}
