import api from '@/api/axios';

export interface InterviewFeedback {
  comment: string;
  conceptSummary: string;
  modelAnswer: string;
  recommendKeywords: string[];
}

export interface AnswerRequest {
  interviewId: number;
  interviewContent: string;
  userReply: string;
}

export interface SubmitInterviewAnswersRequest {
  answers: AnswerRequest[];
  nth: number;
}

export interface SubmitInterviewAnswersResponse {
  stateCode: number;
  message: string;
  data: InterviewFeedback[];
}
export async function submitInterviewAnswers(
  payload: SubmitInterviewAnswersRequest
): Promise<InterviewFeedback[]> {
  const res = await api.post<SubmitInterviewAnswersResponse>('/api/interview/answers', payload);

  return res.data.data;
}
