import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onboardingService } from "../services/onboarding.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/src/types/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth.store";

export function useSetSource() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setOnboarding } = useAuthStore((state) => state);
  return useMutation({
    mutationFn: (data: { source: string }) => onboardingService.onboardingSource(data),
    onSuccess: (res) => {
      setOnboarding(1, true);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      const redirect = sessionStorage.getItem("postLoginRedirect");
      if (redirect) {
        sessionStorage.removeItem("postLoginRedirect");
        router.replace(redirect);
      } else {
        router.replace("/trips/groups");
      }
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useGetPlacesSuggestion(search: string, enabled: boolean) {
  return useQuery({
    queryKey: ["places", search],
    queryFn: () => onboardingService.getPlacesSuggestion(search),
    enabled: enabled && search.length >= 2,
  });
}
