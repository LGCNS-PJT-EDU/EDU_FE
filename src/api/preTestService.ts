import api from '@/api/axios';

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

export async function fetchPreTestQuestions(
  subjectId: number,
): Promise<PreTestQuestion[]> {
  const res = await api.get<ApiResp<RawPreQuestion[]>>("/api/exam/pre", {
    params: { subjectId },
  });

console.log("subjectId from URL:", subjectId); // ✅ 로그 찍어보세요

  return (res.data.data ?? []).map<PreTestQuestion>((q) => {
    const choices = [q.choice1, q.choice2, q.choice3, q.choice4]
      .filter(Boolean)
      .map((text, idx) => ({
        id: idx + 1,
        text: text as string,
        value: String(idx + 1),
      }));

    return {
      id: q.questionId,
      question: q.question,
      choices,
      chapterNum: q.chapterNum,
      chapterName: q.chapterName,
      difficulty: q.difficulty,
      answerNum: q.answerNum,
    };
  });
}

export async function submitPreTest(payload: PreTestSubmitPayload) {
  const res = await api.post<ApiResp<any>>("/api/exam/pre", payload);
  return res.data;
}