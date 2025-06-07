import api from "@/api/axios";

export async function sendInterviewFeedback(
  interviewId: number, 
  content: string,
  nth:number
): Promise<string> {

  const payload = {
    interviewId,
    userReply: content,
    nth,
  };

  console.log("서버 전송 payload:", payload);
  const res = await api.post<{ data:{ interviewFeedback:string} }>(
    '/api/interview/feedback',
     payload
    );
  const feedback = res.data.data.interviewFeedback;
  if(!feedback || feedback.trim()===''){
    throw new Error('AI 피드백이 없습니다.');
  }
  return feedback;
}

