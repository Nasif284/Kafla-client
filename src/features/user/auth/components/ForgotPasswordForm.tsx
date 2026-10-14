"use client";

import { useState, FormEvent } from "react";
import { useForgotPasswordOtp } from "@/src/features/user/auth/hooks/auth.hooks";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const sendOtp = useForgotPasswordOtp();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    localStorage.setItem("email", email);
    sendOtp.mutate({ email });
  };

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-[#3f4944] ml-1">
          Enter your email
        </label>
        <div className="flex items-center h-12 px-4 rounded-xl bg-[#e0e3e0] transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-[#005440]">
          <input
            id="email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#181d1a] placeholder:text-[#6f7a74] text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={sendOtp.isPending || !email}
        className="w-full h-12 bg-[#0f6e56] hover:bg-[#005440] text-white font-bold rounded-xl transition-all active:scale-[0.98] mt-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer flex items-center justify-center shadow-sm"
      >
        {sendOtp.isPending ? (
          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Send OTP"
        )}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
