import api from "@/api/axios";

export interface Choice {
  choiceId: number;
  choiceNum: number;
  choice: string;
  value: string;
}
export interface Question {
  diagnosisId: number;
  question: string;
  questionType: string;
  choices: Choice[];
}
export interface RawData {
  COMMON: Question[];
  BE: Question[];
  FE: Question[];
  roadmap_exist: boolean;
}
export interface DiagnosisAnswerReq {
  questionId: number;
  answer: string;
}
export interface Subject {
  subjectId: number;
  subjectName: string;
  subjectOrder: number;
}
export interface RoadmapPayload {
  uuid?: string;                    //roadmapService에서 사용하려고 optional 설정함
  userLocationSubjectId: number;
  subjects: Subject[];
}

interface ApiResp<T> {
  stateCode: number;
  message: string;
  data: T;
}

export async function fetchDiagnosisQuestions(): Promise<RawData> {
  const res = await api.get<ApiResp<RawData>>("/api/diagnosis");
  return res.data.data;
}

export async function submitDiagnosis(
  payload: DiagnosisAnswerReq[],
): Promise<RoadmapPayload> {
  const res = await api.post<ApiResp<RoadmapPayload>>(
    "/api/diagnosis",
    payload,
  );
  console.log("진단 결과 로드맵:", res.data);
  return res.data.data;
}
