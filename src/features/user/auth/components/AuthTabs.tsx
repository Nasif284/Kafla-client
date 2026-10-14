"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AuthTabs = () => {
  const pathName = usePathname();
  const isActive = (path: string): boolean => path === pathName;

  return (
    <nav className="flex justify-center gap-8 mb-6 sm:mb-8" aria-label="Auth tabs">
      <Link
        href={"/login"}
        className={`font-headline font-bold text-base sm:text-lg pb-2 border-b-2 transition-all min-h-[44px] flex items-center ${
          isActive("/login")
            ? "border-[#0f6e56] text-[#0f6e56]"
            : "border-transparent text-[#3f4944] hover:text-[#005440]"
        }`}
        aria-current={isActive("/login") ? "page" : undefined}
      >
        Log in
      </Link>
      <Link
        href={"/signup"}
        className={`font-headline font-bold text-base sm:text-lg pb-2 border-b-2 transition-all min-h-[44px] flex items-center ${
          isActive("/signup")
            ? "border-[#0f6e56] text-[#0f6e56]"
            : "border-transparent text-[#3f4944] hover:text-[#005440]"
        }`}
        aria-current={isActive("/signup") ? "page" : undefined}
      >
        Sign up
      </Link>
    </nav>
  );
};

export default AuthTabs;
