import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGuestRoadmap } from "@/api/roadmapService";
import { RoadmapPayload } from "@/api/diagnosisService";
import { isLoggedIn } from "@/store/authGlobal";
import { useGuestUuidStore } from "@/store/useGuestUuidStore";

export function usePromoteGuestRoadmap() {
  const navigate = useNavigate();
  
  const uuid      = useGuestUuidStore((s) => s.uuid);
  const setUuid   = useGuestUuidStore((s) => s.setUuid);
  const loggedIn = isLoggedIn();

  const {data: roadmap, isSuccess, isError, error, } = useQuery<RoadmapPayload, Error>({
    queryKey: ["guestRoadmap", uuid],
    queryFn: uuid ? () => fetchGuestRoadmap(uuid) : undefined,
    enabled: loggedIn && !!uuid,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && roadmap) {
      setUuid(null);  
      navigate("/roadmap", { state: roadmap, replace: true });
    }

    if (isError) {
      console.error("게스트 로드맵 승격 실패", error);
    }
  }, [isSuccess, isError, roadmap, error, navigate]);
}
