import api from '@/api/axios';

interface RawPostQuestion {
  questionId: number;
  question: string;
  choice1?: string;
  choice2?: string;
  choice3?: string;
  choice4?: string;
  answerNum: number;
}

export interface PostTestChoice {
  id: number;
  text: string;
  value: string;
}

export interface PostTestQuestion {
  id: number;
  question: string;
  choices: { id: number; text: string; value: string }[];
}

export interface PostTestAnswer {
  id: number;
  chapterNum: number;
  chapterName: string;
  difficulty: string;
  answerTF: boolean;
  userAnswer: number;
}

export interface PostTestSubmitPayload {
  roadmapId: number;
  subjectId: number;
  startDate: string;
  duration: number;
  submitCnt: number;
  answers: PostTestAnswer[];
}

interface ApiResp<T> {
  stateCode: number;
  message: string;
  data: T;
}

export async function fetchPostTestQuestions(
  subjectId: number,
): Promise<PostTestQuestion[]> {
  const res = await api.get<ApiResp<RawPostQuestion[]>>("/api/exam/post", {
    params: { subjectId },
  })
  console.log("post 응답 확인:", res.data); // 응답 구조 확인용
  return (res.data.data ?? []).map<PostTestQuestion>((q) => {
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

export async function submitPostTest(payload: PostTestSubmitPayload) {
  const res = await api.post<ApiResp<any>>("/api/exam/post", payload);
  return res.data;
}