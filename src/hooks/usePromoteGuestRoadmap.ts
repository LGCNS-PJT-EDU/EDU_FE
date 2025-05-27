import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGuestRoadmap } from "@/api/roadmapService";
import { RoadmapPayload } from "@/api/diagnosisService";
import { useGuestUuidStore } from "@/store/useGuestUuidStore";

export function usePromoteGuestRoadmap(shouldPromote: boolean) {
  const uuid      = useGuestUuidStore((s) => s.uuid);
  const queryClient = useQueryClient();

  const { mutate, status } = useMutation<RoadmapPayload, Error, void>({
    mutationFn: () => fetchGuestRoadmap(uuid!),
    onSuccess: (data) => {
      queryClient.setQueryData(["userRoadmap"], data);
      useGuestUuidStore.getState().setUuid(null);
    },
  });
  useEffect(() => {
    if (shouldPromote && uuid && status === "idle") {
      mutate();
    }
  }, [shouldPromote, uuid, status, mutate]);

  return { isLoading: status === "pending", isSuccess: status === "success"};
}