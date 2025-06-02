import api from "@/api/axios";

export interface SolutionResDto {
  isPre: boolean;
  nth: number;
  subNm: string;        // 과목명
  examContent: string;  // 문제 텍스트
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  examAnswer: number;   // 정답 값 (1~4)
  userAnswer: number;   // 사용자 답 (1~4)
  solution: string;     // 해설
  examLevel: string;    // 문제 레벨
}

interface ApiWrapper<T> {
  stateCode: number
  message: string
  data: T
}

export async function fetchSolutions(
  subjectId: number
): Promise<SolutionResDto[]> {
  const res = await api.get<ApiWrapper<SolutionResDto[]>>(
    `/api/solution?subjectId=${subjectId}`
  )
  return res.data.data
}