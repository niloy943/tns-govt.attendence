import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings } from "../api/endpoints/settings";
import { dummySettings } from "../data/dummy/settings";

const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === "true";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: USE_DUMMY
      ? () => Promise.resolve({ ...dummySettings })
      : fetchSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSettings) => {
      if (USE_DUMMY) {
        Object.assign(dummySettings, newSettings);
        return Promise.resolve(dummySettings);
      }
      return updateSettings(newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });
}
