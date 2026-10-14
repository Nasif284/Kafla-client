"use client";

import { useForm } from "react-hook-form";
import PasswordField from "../components/PasswordField";
import { useRegister } from "@/src/features/user/auth/hooks/auth.hooks";
import { RegisterFormData, RegisterSchema } from "../validators/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAuthStore } from "@/src/store/auth.store";

const SignUpFormContent = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const registerMutation = useRegister();
  const params = useSearchParams();
  const redirect = params.get("redirect");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect || "/trips/groups");
    }
  }, [isAuthenticated, redirect, router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    if (redirect) {
      sessionStorage.setItem("postLoginRedirect", redirect);
    }
    registerMutation.mutate({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold mb-2 text-[#3f4944] ml-1">
          Full name
        </label>

        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          {...register("fullName")}
          className="w-full h-12 px-4 rounded-xl bg-[#e0e3e0] text-[#181d1a] placeholder:text-[#6f7a74]/60 text-sm sm:text-base transition-all focus:bg-white focus:ring-2 focus:ring-[#0f6e56] focus:outline-none focus:shadow-sm"
        />

        {errors.fullName && <p className="text-sm text-red-500 mt-1 ml-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-2 text-[#3f4944] ml-1">
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          {...register("email")}
          className="w-full h-12 px-4 rounded-xl bg-[#e0e3e0] text-[#181d1a] placeholder:text-[#6f7a74]/60 text-sm sm:text-base transition-all focus:bg-white focus:ring-2 focus:ring-[#0f6e56] focus:outline-none focus:shadow-sm"
        />

        {errors.email && <p className="text-sm text-red-500 mt-1 ml-1">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PasswordField<RegisterFormData>
          id="password"
          label="Password"
          placeholder="••••••••"
          register={register}
          error={errors.password?.message}
        />

        <PasswordField<RegisterFormData>
          id="confirmPassword"
          label="Confirm password"
          placeholder="••••••••"
          register={register}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-12 bg-[#0f6e56] hover:bg-[#005440] text-white font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer shadow-sm text-base sm:text-lg"
        >
          {registerMutation.isPending ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Create account"
          )}
        </button>
      </div>
    </form>
  );
};

const SignUpPage = () => {
  return (
    <Suspense fallback={<div className="h-48 flex items-center justify-center">Loading...</div>}>
      <SignUpFormContent />
    </Suspense>
  );
};

export default SignUpPage;
