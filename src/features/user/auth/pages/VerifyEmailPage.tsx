"use client";

import { useAuthStore } from "@/src/store/auth.store";
import { useSendOtp, useVerify } from "../hooks/auth.hooks";
import OTPVerificationCard from "../components/OTPVerificationCard";

export default function VerifyEmailPage() {
  const user = useAuthStore((state) => state.user);
  const verify = useVerify();
  const resend = useSendOtp();

  return (
    <OTPVerificationCard
      email={user?.email ?? ""}
      onVerify={(code) =>
        verify.mutate({
          email: user?.email ?? "",
          code,
        })
      }
      onResend={() =>
        resend.mutate({
          email: user?.email ?? "",
          purpose: "email_verify",
        })
      }
    />
  );
}
