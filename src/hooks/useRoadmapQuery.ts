import { useQuery } from "@tanstack/react-query";
import { fetchRoadmap } from "@/api/roadmapService";
import { RoadmapPayload } from "@/api/diagnosisService";
import { useGuestUuidStore } from "@/store/useGuestUuidStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export function useRoadmapQuery() {
  const uuid = useGuestUuidStore((s) => s.uuid);
  const navigate = useNavigate();

  const query = useQuery< RoadmapPayload, Error >({
    queryKey: ["roadmap", uuid],
    queryFn: () => fetchRoadmap(uuid ?? "takeit"),
    staleTime: Infinity,
  });

  /* 404에러(로드맵, uuid 둘 다 없을 때) 잡아서 진단으로 보내기 */
  useEffect(() => {
    if (query.isError) {
      const err = query.error;
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        navigate("/diagnosis", { replace: true });
      }
    }
  }, [query.isError, query.error, navigate]);

  useEffect(() => {
     console.log("[useRoadmapQuery] data →", query.data);
   }, [query.data]);

  return query;
}