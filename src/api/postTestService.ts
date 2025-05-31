import api from '@/api/axios';

interface RawPostQuestion {
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

export interface PostTestChoice {
  id: number;
  text: string;
  value: string;
}

export interface PostTestAnswer {
  examId: number;
  chapterNum: number;
  chapterName: string;
  difficulty: string;
  answerTF: boolean;
  userAnswer: number;
}
export interface PostTestQuestion {
  id: number;
  question: string;
  choices: { id: number; text: string; value: string }[];
  chapterNum: number;
  chapterName: string;
  difficulty: string;
  answerNum: number;
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

//사후 평가 문제 조회
export async function fetchPostTestQuestions(
  subjectId: number,
): Promise<PostTestQuestion[]> {
  const res = await api.get<ApiResp<RawPostQuestion[]>>("/api/exam/post", {
    params: { subjectId },
  })

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
      chapterNum: q.chapterNum,
      chapterName: q.chapterName,
      difficulty: q.difficulty,
      answerNum: q.answerNum,
    };
  });
}

//사후평가 결과 제출
export async function submitPostTest(payload: PostTestSubmitPayload) {
  const res = await api.post<ApiResp<any>>("/api/exam/post", payload);
  return res.data;
}

//  로드맵 ID 포함된 서브젝트 상세 정보 조회
export async function fetchSubjectDetail(subjectId: number): Promise<any> {
  const res = await api.get<ApiResp<any>>("/api/roadmap/subject", {
    params: { subjectId },
  });
  return res.data.data; // roadmapId 포함되어 있어야 함
}
