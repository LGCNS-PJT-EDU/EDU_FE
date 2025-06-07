import api from "@/api/axios";

export interface OpenAiMessage{
    role:string;
    content:string;
}

export interface OpenAiChoice{
    message:OpenAiMessage;
}

export interface OpenAiResponse {
    choices: OpenAiChoice[];
}

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
  const res = await api.post<{ data:{ sendInterviewFeedback:string} }>(
    '/api/interview/feedback',
     payload
    );
  const feedback = res.data.data.sendInterviewFeedback;
  if(!feedback || feedback.trim()===''){
    throw new Error('AI 피드백이 없습니다.');
  }
  return feedback;
}

