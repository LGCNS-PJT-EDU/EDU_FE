import { useQuery } from "@tanstack/react-query";
import { fetchRoadmap } from "@/api/roadmapService";
import { RoadmapPayload } from "@/api/diagnosisService";
import { useGuestUuidStore } from "@/store/useGuestUuidStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

interface useRoadmapQueryOptions {
  enabled?: boolean;
  refetchOnMount?: boolean | "always";
}

export function useRoadmapQuery({
  enabled = true,
  refetchOnMount = false,
}: useRoadmapQueryOptions = {}) {

  const uuid = useGuestUuidStore((s) => s.uuid);

  const query = useQuery< RoadmapPayload, Error >({
    queryKey: ["roadmap", uuid],
    queryFn: () => fetchRoadmap(uuid ?? "takeit"),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,

    enabled,
    refetchOnMount,
  });

  useEffect(() => {
     console.log("[useRoadmapQuery] data →", query.data);
   }, [query.data]);

  return query;
}