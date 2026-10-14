"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface PasswordFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: string;
}

export default function PasswordField<T extends FieldValues>({
  id,
  label,
  placeholder,
  register,
  error,
}: PasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-[#3f4944] ml-1">
        {label}
      </label>

      <div className="flex items-center h-12 px-4 rounded-xl bg-[#e0e3e0] transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0f6e56] focus-within:shadow-sm">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="current-password"
          {...register(id)}
          className="w-full bg-transparent border-none focus:ring-0 outline-none text-[#181d1a] placeholder:text-[#6f7a74] text-sm sm:text-base"
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-[#3f4944] hover:text-[#005440] transition-colors flex items-center justify-center min-w-[36px] min-h-[36px] ml-1 flex-shrink-0 cursor-pointer rounded-lg hover:bg-black/5"
        >
          {visible ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
