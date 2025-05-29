import api from "@/api/axios";
import { RoadmapPayload, Subject } from "./diagnosisService";

interface ApiResp<T> {
  stateCode: number;
  message: string;
  data: T;
}

export async function fetchRoadmap(uuid?: string): Promise<RoadmapPayload> {
  // uuid 없으면 takeit으로 보냄
  const uuidParam = uuid ?? "takeit";
  const res = await api.get<ApiResp<RoadmapPayload>>("/api/roadmap", {
    params: { uuid: uuidParam },
  });
  return res.data.data;
}

export interface SubjectUpdateReq {
  subjectId: number;
  subjectName: string;
  subjectOrder: number;
}

export async function updateRoadmap(
  payload: SubjectUpdateReq[],
): Promise<void> {
  await api.put<ApiResp<unknown>>('/api/roadmap/user', payload);
}