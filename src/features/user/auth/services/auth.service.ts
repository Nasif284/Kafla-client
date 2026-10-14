import { userApi as api } from "../../../../lib/api-client";
import {
  LoginInput,
  RegisterInput,
  ResetPassword,
  SendOtp,
  verifyEmail,
  VerifyOtp,
} from "../interfaces/auth.interfaces";

export const authService = {
  register: async (data: RegisterInput) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  verifyEmail: async (data: verifyEmail) => {
    const res = await api.post("/auth/verify", data);
    return res.data;
  },

  sendOtp: async (data: SendOtp) => {
    const res = await api.post("/auth/send-otp", data);
    return res.data;
  },

  login: async (data: LoginInput) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh");
    return res.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const res = await api.post("/auth/password/forgot", data);
    return res.data;
  },

  resetPassword: async (data: ResetPassword) => {
    const res = await api.post("/auth/password/reset", data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  verifyOtp: async (data: VerifyOtp) => {
    const res = await api.post("/auth/verify-otp", data);
    return res.data;
  },

  googleAuth: async (token: string) => {
    const res = await api.post("/auth/google", { token });
    return res.data;
  },

  authMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
