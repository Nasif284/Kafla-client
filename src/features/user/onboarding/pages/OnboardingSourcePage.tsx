"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, ArrowRight } from "lucide-react";
import SourceOptions from "../components/SourceOptions";
import { useSetSource } from "../hooks/onboarding.hooks";
import Logo from "@/src/components/Logo";

export default function ReferralSourcePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("Friends or Family");
  const setSource = useSetSource();

  const handleContinue = () => {
    if (!selected) return;
    setSource.mutate({ source: selected });
  };

  const handleSkip = () => {
    const redirect = sessionStorage.getItem("postLoginRedirect");
    if (redirect) {
      sessionStorage.removeItem("postLoginRedirect");
      router.replace(redirect);
    } else {
      router.replace("/trips/groups");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative"
      style={{ backgroundColor: "#F5F5F3" }}
    >
      <main className="w-full max-w-[600px] bg-white rounded-2xl p-5 sm:p-8 md:p-12 flex flex-col items-center shadow-sm z-10">
        <div className="mb-6 sm:mb-8 flex flex-col items-center w-full">
          <div className="mb-4 sm:mb-6">
            <Logo size={36} />
          </div>

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#c9eadb] rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-[#0f6e56]" />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#181d1a] mb-2 text-center tracking-tight font-headline">
            How did you hear about us?
          </h1>
          <p className="text-[#3f4944] text-xs sm:text-sm md:text-base text-center max-w-md">
            This helps us understand where our community is growing.
          </p>
        </div>

        <SourceOptions onSelect={(label: string) => setSelected(label)} selected={selected} />

        <button
          onClick={handleContinue}
          disabled={!selected || setSource.isPending}
          className={`w-full h-12 ${
            setSource.isPending ? "bg-[#0f6e56]/70 cursor-not-allowed" : "bg-[#0f6e56] hover:bg-[#005440]"
          } text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
        >
          {setSource.isPending ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Continue <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 text-xs sm:text-sm text-neutral-500 hover:text-neutral-800 transition-colors font-medium py-1 cursor-pointer"
        >
          Skip for now
        </button>
      </main>

      <div className="fixed top-0 right-0 p-10 opacity-10 pointer-events-none hidden lg:block">
        <div className="relative w-64 h-64 overflow-hidden rounded-2xl rotate-3 shadow-xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoOQtb9fjvKax3zhQ6qPi2ZRsI8fLcvLhLgymVlM75EY7uBC3JVmtm1gw39JapTDZA0qApIo6M5cfXxWwbMWBCtKTeTuuPIhhewAqyIjfPGqDEIvNESFBJYct6-jOwK4psfju86egssUcCV8KoICzBqDZfbE5itSH2GIOYo6jJ6IA2aFZZswbPlDTMdEmQ5GXQWMHMCZgYINDqxxYhdqQNz9FJoue_i_0S5_w7E1E5FffcCDGILWqLpGOCJUd0UNT7xJD3WMamMfY"
            alt=""
            className="w-full h-full object-cover grayscale"
          />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 p-10 opacity-10 pointer-events-none hidden lg:block">
        <div className="relative w-72 h-48 overflow-hidden rounded-2xl -rotate-6 shadow-xl">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB050z8TQ2sr5HmpW9coaUcAjOuUsymIuiBqwgB9s0udSpk8lGfKvFFwhD1v01A9SewT7k86XHmzYKiw-TY9Y4Usg_rpPvsb2GAmfwn4sWmZBp5VxvOC1DDP2ajz4QmUF_NUjk5a6yyOX5hoXW0mc_h7egq7a_G4oy6N_Zs_nPJqAScaYPG0O9BJRxUdM6aNnjbovkCfqZ6k9dKhDVNGOdmRgxCqk4CkXXgduLeLPo7cE5se49s0BK4qTbSPUrkVkSQ0m0JKX0YbWE"
            alt=""
            className="w-full h-full object-cover grayscale"
          />
        </div>
      </div>
    </div>
  );
}
