import api from '@/api/axios';

interface RawPreQuestion {
  questionId: number;
  question: string;
  choice1?: string;
  choice2?: string;
  choice3?: string;
  choice4?: string;
  answerNum: number;
}
export interface PreTestChoice {
  id: number;
  text: string;
  value: string;
}

export interface PreTestAnswer {
  id: number;
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

export async function fetchPreTestQuestions(
  subjectId: number,
): Promise<PreTestQuestion[]> {
  const res = await api.get<ApiResp<RawPreQuestion[]>>("/api/exam/pre", {
    params: { subjectId },
  });


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
    };
  });
}

export async function submitPreTest(payload: PreTestSubmitPayload) {
  const res = await api.post<ApiResp<any>>("/api/exam/pre", payload);
  return res.data;
}