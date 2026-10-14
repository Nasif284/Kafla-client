"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthMe } from "@/src/features/user/auth/hooks/auth.hooks";
import { useAuthStore } from "@/src/store/auth.store";
import { connectSocket, disconnectSocket } from "@/src/socket/socket";
import LoadingSpinner from "../Loading";

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { data, isLoading, isError } = useAuthMe();
  const me = data?.data;

  const { setUser, setOnboarding, logout } = useAuthStore((state) => state);

  useEffect(() => {
    if (isError) {
      logout();
      router.replace("/login");
      return;
    }

    if (!me) return;
    setUser(me.user);

    if (!me.isVerified) {
      router.replace("/verify");
      return;
    }

    setOnboarding(me.onboardingStep ?? 1, me.onboardingCompleted ?? true);
  }, [me, isError, router, setUser, setOnboarding, logout]);

  useEffect(() => {
    if (!me || !me.isVerified) {
      return;
    }
    const socket = connectSocket();

    const handleConnect = () => {
      console.log("[Socket] Connected:", socket.id);
    };

    const handleError = (error: Error) => {
      console.error("[Socket] Connection error:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleError);
      disconnectSocket();
    };
  }, [me]);

  const shouldRedirect = isError || !me?.isVerified;

  if (isLoading || shouldRedirect) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
