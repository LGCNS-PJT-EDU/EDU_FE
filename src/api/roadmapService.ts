import api from "@/api/axios";
import { RoadmapPayload, Subject } from "./diagnosisService";

interface ApiResp<T> {
  stateCode: number;
  message: string;
  data: T;
}

interface UserRoadmapResp {
  subjects: Subject[];
  roadmapName: string;
  userLocationSubjectId: number;
}
export async function fetchUserRoadmap(): Promise<RoadmapPayload> {
  const res = await api.get<ApiResp<UserRoadmapResp>>("/api/roadmap/user");
  const { subjects, userLocationSubjectId } = res.data.data;

  return {
    userLocationSubjectId,
    subjects,
  };
}

export async function fetchGuestRoadmap(
  uuid: string,
): Promise<RoadmapPayload> {
  const res = await api.post<ApiResp<RoadmapPayload>>("/api/roadmap/guest", {
    uuid,
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