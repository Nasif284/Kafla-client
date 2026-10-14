"use client";

import { useEffect, useState } from "react";
import OTPVerificationCard from "../components/OTPVerificationCard";
import { useSendOtp, useVerifyOtp } from "../hooks/auth.hooks";

export default function ForgotPasswordVerifyPage() {
  const [email, setEmail] = useState("");

  const verify = useVerifyOtp();
  const resend = useSendOtp();

  useEffect(() => {
    setEmail(localStorage.getItem("email") ?? "");
  }, []);

  return (
    <OTPVerificationCard
      email={email}
      onVerify={(code) =>
        verify.mutate({
          email,
          code,
          purpose: "password_reset",
        })
      }
      onResend={() =>
        resend.mutate({
          email,
          purpose: "password_reset",
        })
      }
    />
  );
}
