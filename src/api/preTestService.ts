import api from '@/api/axios';
import { SubjectDetail } from '@/hooks/useSubjectDetail';

interface RawPreQuestion {
  questionId: number;
  question: string;
  choice1?: string;
  choice2?: string;
  choice3?: string;
  choice4?: string;
  answerNum: number; 
  chapterNum: number;
  chapterName: string;
  difficulty: string;
}

export interface PreTestChoice {
  id: number;
  text: string;
  value: string;
}

export interface PreTestAnswer {
  examId: number;
  examContent: string;
  chapterNum: number;
  chapterName: string;
  difficulty: string;
  answerTF: boolean;
  userAnswer: number;
}

export interface PreTestQuestion {
  id: number;
  question: string;
  choices: { id: number; text: string; value: string }[];
  chapterNum: number;
  chapterName: string;
  difficulty: string;
  answerNum: number; 
}

export interface PreTestSubmitPayload {
  roadmapId: number;
  subjectId: number;
  startDate: string;
  duration: number;
  submitCnt: number;
  answers: PreTestAnswer[];
}

interface ApiResp<T> {
  stateCode: number;
  message: string;
  data: T;
}

// 셔플 유틸
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 사전 평가 문제 조회
export async function fetchPreTestQuestions(
  subjectId: number,
): Promise<PreTestQuestion[]> {
  const res = await api.get<ApiResp<RawPreQuestion[]>>("/api/exam/pre", {
    params: { subjectId },
  }

  );

  return (res.data.data ?? []).map<PreTestQuestion>((q) => {
    // 1. 원본 choices 구성
    const originalChoices: PreTestChoice[] = [q.choice1, q.choice2, q.choice3, q.choice4]
      .filter((c): c is string => Boolean(c))
      .map((text, idx) => ({
        id: idx + 1,            // 원본 key (1~4)
        text,
        value: String(idx + 1), // 서버로 보낼 값
      }));

    // 2. 셔플
    const shuffledChoices = shuffleArray(originalChoices);

    // 3. 원래 answerNum에 해당하는 choice가 셔플된 배열의 몇 번째인지 다시 계산
    const originalAnswerId = q.answerNum;
    const correctChoice = shuffledChoices.find((c) => c.id === originalAnswerId);
    const shuffledAnswerNum = correctChoice
      ? shuffledChoices.indexOf(correctChoice) + 1
      : 1; // fallback

    return {
      id: q.questionId,
      question: q.question,
      choices: shuffledChoices,
      chapterNum: q.chapterNum,
      chapterName: q.chapterName,
      difficulty: q.difficulty,
      answerNum: q.answerNum, 
    };
  });
}

// 사전 평가 결과 제출
export async function submitPreTest(payload: PreTestSubmitPayload) {
  const res = await api.post<ApiResp<any>>("/api/exam/pre", payload);
  return res.data;
}

// 로드맵 ID 포함된 서브젝트 상세 정보 조회
export async function fetchSubjectDetail(
  subjectId: number,
): Promise<SubjectDetail> {
  const res = await api.get<ApiResp<SubjectDetail>>("/api/roadmap/subject", {
    params: { subjectId },
  });
  return res.data.data;
}