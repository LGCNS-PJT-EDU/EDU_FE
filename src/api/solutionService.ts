import api from '@/api/axios';

export interface SolutionResDto {
  isPre: boolean;
  nth: number;
  subNm: string;
  examContent: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  examAnswer: number;
  userAnswer: number;
  solution: string;
  examLevel: string;
}

interface ApiWrapper {
  stateCode: number;
  message: string;
  data: {
    correctCnt: number;
    solutions: SolutionResDto[];
  };
}
export async function fetchSolutions(subjectId: number): Promise<{
  correctCnt: number;
  solutions: SolutionResDto[];
}> {
  const res = await api.get<ApiWrapper>(`/api/solution?subjectId=${subjectId}`);

  return {
    correctCnt: res.data.data?.correctCnt ?? 0,
    solutions: Array.isArray(res.data.data?.solutions) ? res.data.data.solutions : [],
  };
}