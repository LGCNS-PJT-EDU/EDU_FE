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

export const fetchDefaultRoadmap = (roadmap: 1 | 2) =>
  api
    .get<RoadmapPayload>('/roadmap/default', { params: { roadmap } })
    .then((res) => res.data);

// 타입이 필요할 경우 여기서 export
export type { RoadmapPayload };
