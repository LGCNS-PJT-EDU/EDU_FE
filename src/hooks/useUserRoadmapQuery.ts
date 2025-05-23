import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { fetchUserRoadmap } from "@/api/roadmapService";
import { RoadmapPayload } from "@/api/diagnosisService";
import { isLoggedIn } from "@/store/authGlobal";

export function useUserRoadmapQuery() {
  const enabled = isLoggedIn();

  return useQuery<RoadmapPayload | null, Error>({
    queryKey : ["userRoadmap"],
    enabled,
    retry    : false,
    queryFn  : async () => {
      try {
        return await fetchUserRoadmap();            // 로드맵 반환
      } catch (err) {
        /* 404 = 로드맵 없음 → null 반환 (오류 처리 X) */
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 0,
  });
}
