import { useQuery } from "@tanstack/react-query";
import { fetchRoadmap } from "@/api/roadmapService";
import { RoadmapPayload } from "@/api/diagnosisService";
import { useGuestUuidStore } from "@/store/useGuestUuidStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export function useRoadmapQuery() {
  const uuid = useGuestUuidStore((s) => s.uuid);

  const query = useQuery< RoadmapPayload, Error >({
    queryKey: ["roadmap", uuid],
    queryFn: () => fetchRoadmap(uuid ?? "takeit"),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
     console.log("[useRoadmapQuery] data →", query.data);
   }, [query.data]);

  return query;
}