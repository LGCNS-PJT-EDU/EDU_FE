import api from "@/api/axios";

export interface SolutionResDto {
  isPre: boolean;
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

/** evalType 은 'pre' 또는 'post' */
export async function fetchSolutions(
  subjectId: number,
  evalType?: 'pre' | 'post'
) {
  const params = new URLSearchParams({ subjectId: String(subjectId) })
  if (evalType) params.append('type', evalType)

  const res = await api.get(`/api/solutions?${params}`)
  return res.data  
}