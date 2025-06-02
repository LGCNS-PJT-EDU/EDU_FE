// /api/interview.ts
import api from '@/api/axios';

export interface OpenAiMessage {
  role: string;
  content: string;
}

export interface OpenAiChoice {
  message: OpenAiMessage;
}

export interface OpenAiResponse {
  choices: OpenAiChoice[];
}

// export async function sendInterviewFeedback(interviewId: number, content: string): Promise<string> {
//   const res = await api.post<{ data: OpenAiResponse }>('/api/interview/feedback', {
//     interviewId,
//     userReply: content,
//   });

//   const choices = res.data.data.choices;

//   if (!choices || choices.length === 0) throw new Error('AI 응답이 비어 있습니다.');

//   return choices[0].message.content;
// }

export async function sendInterviewFeedback(interviewId: number, content: string): Promise<string> {
  const res = await api.post<{ data: { interviewFeedback: string } }>('/api/interview/feedback', {
    interviewId,
    userReply: content,
  });

  const feedback = res.data.data.interviewFeedback;

  if (!feedback) throw new Error('AI 응답이 비어 있습니다.');

  return feedback;
}
