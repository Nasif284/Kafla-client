"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { OTPVerificationCardProps } from "../interfaces/auth.interfaces";
import Logo from "@/src/components/Logo";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 48;

export default function OTPVerificationCard({ email, onVerify, onResend }: OTPVerificationCardProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const canResend = countdown <= 0;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    if (!canResend || !email) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setCountdown(RESEND_SECONDS);
    inputRefs.current[0]?.focus();
    onResend();
  };

  const handleVerify = () => {
    if (!email) return;
    const code = otp.join("");
    if (code.length < OTP_LENGTH) return;
    onVerify(code);
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="font-body text-[#181d1a] flex min-h-screen flex-col bg-[#F5F5F3]">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[480px] bg-white rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col items-center shadow-sm">
          <div className="mb-6 sm:mb-8">
            <Logo size={36} />
          </div>

          <div className="mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#c9eadb] flex items-center justify-center">
            <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-[#005440]" />
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-headline font-bold text-xl sm:text-2xl text-[#181d1a] mb-2 sm:mb-3">
              Verify your email
            </h1>
            <p className="text-[#3f4944] leading-relaxed text-xs sm:text-sm max-w-xs">
              We sent a 6-digit code to your email address.
              <br />
              It expires in 10 minutes.
            </p>
          </div>

          <div
            className="flex justify-center gap-1.5 sm:gap-2.5 mb-6 w-full max-w-full overflow-x-auto py-1"
            role="group"
            aria-label="One-time passcode"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                placeholder="·"
                aria-label={`Digit ${index + 1}`}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                className="w-10 h-13 sm:w-[50px] sm:h-[60px] border-2 border-[#e0e3e0] bg-[#f1f4f1] rounded-xl text-center text-xl sm:text-2xl font-bold text-[#005440] focus:border-[#005440] focus:ring-2 focus:ring-[#005440]/30 focus:bg-white transition-all outline-none caret-transparent flex-shrink-0"
              />
            ))}
          </div>

          <div className="mb-8">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[#005440] font-semibold text-sm hover:underline min-h-[44px] px-3 flex items-center justify-center cursor-pointer"
              >
                Resend code
              </button>
            ) : (
              <p className="text-[#3f4944] font-medium text-sm">
                Resend code in <span className="text-[#181d1a]">{formatCountdown(countdown)}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={!isComplete}
            className="w-full bg-[#0f6e56] hover:bg-[#005440] text-white h-12 rounded-xl font-headline font-bold text-base active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            Verify and continue
          </button>

          <div className="mt-6 sm:mt-8">
            <p className="text-xs text-[#3f4944] text-center opacity-70">
              By continuing, you agree to Kafla&apos;s{" "}
              <Link href="/terms" className="underline hover:text-[#005440]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-[#005440]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-[#3f4944] text-xs sm:text-sm text-center">
          <span className="font-headline font-bold text-[#0F6E56]">© 2026 Kafla</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#0F6E56] underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#0F6E56] underline-offset-4 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
