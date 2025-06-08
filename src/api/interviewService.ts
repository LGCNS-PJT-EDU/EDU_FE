import api from "@/api/axios";

export interface InterviewFeedback {
  interviewId: number;
  userReply: string;
  nth: number;
  aiFeedback: string;
}

export async function submitInterviewAnswers(
  answers: { interviewId: number; userReply: string; nth: number }[]
): Promise<InterviewFeedback[]> {
  const payload = { answers };

  console.log("서버 전송 payload:", payload);

  const res = await api.post<{ data: InterviewFeedback[] }>(
    '/api/interview/answers',
    payload
  );

  return res.data.data; 
}
