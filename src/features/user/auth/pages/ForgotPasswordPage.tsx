"use client";

import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import Logo from "@/src/components/Logo";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ backgroundColor: "#F5F5F3" }}>
      <main className="w-full max-w-[480px] bg-white rounded-2xl p-12 flex flex-col items-center shadow-sm z-10 relative">
        <div className="mb-8 flex flex-col items-center w-full">
          <div className="mb-6">
            <Logo size={32} />
          </div>

          <div className="w-14 h-14 bg-[#c9eadb] rounded-full flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-[#0f6e56]" />
          </div>

          <h1 className="text-2xl font-bold text-[#181d1a] mb-2 text-center tracking-tight font-headline">
            Reset your password
          </h1>
        </div>

        <ForgotPasswordForm />

        <div className="mt-10">
          <Link
            href="/login"
            className="group flex items-center gap-2 text-[#3f4944] hover:text-[#005440] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to login
          </Link>
        </div>
      </main>
    </div>
  );
}
