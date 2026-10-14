import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(4, "Full name must be at least 4 characters.")
      .max(100, "Full name cannot exceed 100 characters."),

    email: z.string().email("Invalid email address format.").trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password cannot exceed 128 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
