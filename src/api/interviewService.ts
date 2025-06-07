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
  const res = await api.post<{ data: OpenAiResponse }>('/api/interview/feedback', payload);

  const choices = res.data.data.choices;
  if (!choices || choices.length === 0) throw new Error('AI 응답이 비어 있습니다.');
  return choices[0].message.content;
}

