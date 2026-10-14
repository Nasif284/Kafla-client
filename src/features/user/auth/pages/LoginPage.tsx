"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import PasswordField from "../components/PasswordField";
import { useLogin } from "@/src/features/user/auth/hooks/auth.hooks";
import { LoginFormData, loginSchema } from "../validators/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { userApi } from "@/src/lib/api-client";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginFormContent = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const params = useSearchParams();
  const redirect = params.get("redirect");

  useEffect(() => {
    if (redirect) {
      sessionStorage.setItem("postLoginRedirect", redirect);
    }
  }, [redirect]);

  useEffect(() => {
    if (isAuthenticated) {
      if (redirect) {
        userApi
          .get("/auth/me")
          .then(() => {
            router.replace(redirect);
          })
          .catch(() => {
            useAuthStore.getState().logout();
            localStorage.removeItem("auth-storage");
          });
      } else {
        router.replace("/trips/groups");
      }
    }
  }, [isAuthenticated, redirect, router]);

  const onSubmit = (data: LoginFormValues) => {
    if (redirect) {
      sessionStorage.setItem("postLoginRedirect", redirect);
    }
    login.mutate(data);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[#3f4944] ml-1">
          Email Address
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
          className="w-full h-12 px-4 rounded-xl bg-[#e0e3e0] text-[#181d1a] placeholder:text-[#6f7a74] text-sm sm:text-base transition-all focus:bg-white focus:ring-2 focus:ring-[#0f6e56] focus:outline-none focus:shadow-sm"
        />

        {errors.email && <p className="text-sm text-red-500 mt-1 ml-1">{errors.email.message}</p>}
      </div>

      <PasswordField
        id="password"
        label="Password"
        placeholder="••••••••"
        register={register}
        error={errors.password?.message}
      />

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-bold text-[#005440] hover:underline min-h-[36px] inline-flex items-center"
        >
          Forgot password?
        </Link>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full h-12 bg-[#0f6e56] hover:bg-[#005440] text-white font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer shadow-sm"
        >
          {login.isPending ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Login"
          )}
        </button>
      </div>
    </form>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div className="h-48 flex items-center justify-center">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
};

export default LoginPage;
