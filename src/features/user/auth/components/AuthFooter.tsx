"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AuthFooter = () => {
  const pathName = usePathname();
  const isActive = (path: string): boolean => path === pathName;

  return (
    <>
      <div className="mt-6 sm:mt-8 text-center space-y-3">
        <p className="text-[#3f4944] text-sm">
          {isActive("/login") ? (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href={"/signup"}
                className="text-[#005440] font-bold hover:underline min-h-[44px] inline-flex items-center"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href={"/login"}
                className="text-[#005440] font-bold hover:underline min-h-[44px] inline-flex items-center"
              >
                Log in
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mt-10 text-center">
        <p className="text-[#6f7a74] text-xs leading-relaxed">
          By continuing, you agree to Kafla&apos;s <br className="hidden sm:inline" />
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
    </>
  );
};

export default AuthFooter;
