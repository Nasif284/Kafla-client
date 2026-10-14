"use client";

import { authService } from "@/src/features/user/auth/services/auth.service";
import {
  LoginInput,
  RegisterInput,
  ResetPassword,
  SendOtp,
  verifyEmail,
  VerifyOtp,
} from "../interfaces/auth.interfaces";
import { useAuthStore } from "@/src/store/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/src/types/types";

export function useLogin() {
  const { setUser, setOnboarding } = useAuthStore((state) => state);
  const router = useRouter();
  const sendOtp = useSendOtp();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (res) => {
      setUser(res.data.user);
      toast.success(res.message);

      if (!res.data.isVerified) {
        sendOtp.mutate({ email: res.data.user.email as string, purpose: "email_verify" });
        router.replace("/verify");
      } else {
        setOnboarding(1, res.data.onboardingCompleted ?? true);
        const redirect = sessionStorage.getItem("postLoginRedirect");
        if (redirect) {
          sessionStorage.removeItem("postLoginRedirect");
          router.replace(redirect);
        } else {
          router.replace("/trips/groups");
        }
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useGoogleAuth() {
  const { setUser, setOnboarding } = useAuthStore((state) => state);
  const router = useRouter();

  return useMutation({
    mutationFn: (token: string) => authService.googleAuth(token),
    onSuccess: (res) => {
      setUser(res.data.user);
      toast.success(res.message);

      setOnboarding(1, res.data.onboardingCompleted ?? true);
      const redirect = sessionStorage.getItem("postLoginRedirect");
      if (redirect) {
        sessionStorage.removeItem("postLoginRedirect");
        router.replace(redirect);
      } else {
        router.replace("/trips/groups");
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useRegister() {
  const { setUser, setOnboarding } = useAuthStore((state) => state);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (res) => {
      setUser(res.data);
      setOnboarding(1, false);
      toast.success(res.message);
      router.replace("/verify");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useVerify() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: verifyEmail) => authService.verifyEmail(data),
    onSuccess: (res) => {
      toast.success(res.message);
      const redirect = sessionStorage.getItem("postLoginRedirect");
      if (redirect) {
        sessionStorage.removeItem("postLoginRedirect");
        router.replace(redirect);
      } else {
        router.replace("/trips/groups");
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (data: SendOtp) => authService.sendOtp(data),
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout, setOnboarding } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.clear();
      logout();
      setOnboarding(0, false);
      router.replace("/login");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useVerifyOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyOtp) => authService.verifyOtp(data),
    onSuccess: (res) => {
      toast.success(res.message);
      router.push("/forgot-password/reset");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPassword) => authService.resetPassword(data),
    onSuccess: (res) => {
      toast.success(res.message);
      router.replace("/login");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useForgotPasswordOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string }) => authService.forgotPassword(data),
    onSuccess: (res) => {
      toast.success(res.message);
      router.push("/forgot-password/verify");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.error?.message || "Something went wrong");
    },
  });
}

export function useAuthMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.authMe(),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
}
