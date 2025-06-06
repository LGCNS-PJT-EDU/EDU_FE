import axios from '@/api/axios';

export interface ScoreSet {
  [key: string]: number;
}

export interface FeedbackItem {
  info: {
    userId: string;
    date: string;
    subject: string;
  };
  scores: Record<string, number>;     
  feedback: {
    strength: Record<string, string>;
    weakness: Record<string, string>;
    final: string;
  }
}

export const fetchUserFeedback = async (): Promise<FeedbackItem[]> => {
  const res = await axios.get('/api/feedback/retrieve');
  return res.data.data; 
};