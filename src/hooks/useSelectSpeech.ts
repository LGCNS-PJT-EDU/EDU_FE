import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { useQuery } from '@tanstack/react-query';

interface Subject {
  subId: number;
  subjectNm: string;
  isComplete: boolean;
}

interface ApiResponse {
  stateCode: number;
  message: string;
  data: {
    existingSubjectIds: Subject[];
    missingSubjectIds: Subject[];
  };
}

const fetchSubjects = async (): Promise<ApiResponse['data']> => {
  const res = await api.get<ApiResponse>('/api/interview/subject');
  return res.data.data;
};

export const useSelectSpeech = () => {
  return useQuery({
    queryKey: ['selectSpeechSubjects'],
    queryFn: fetchSubjects,
  });
};
