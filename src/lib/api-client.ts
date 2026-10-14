import axios from "axios";
import { HttpCodes } from "../utils/constants/HttpCodes.containts";
import { useAuthStore } from "@/src/store/auth.store";

export const userApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1",
  withCredentials: true,
});

userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status === HttpCodes.UNAUTHORIZED && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
        await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );
        return userApi(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          try {
            useAuthStore.getState().logout();
            localStorage.removeItem("auth-storage");
          } catch {
            // ignore
          }

          const currentPath = window.location.pathname;
          // Do not bounce if on public routes: landing page (/), /login, /signup, /forgot-password, /verify, /mcp-auth
          const isPublicRoute =
            currentPath === "/" ||
            currentPath.startsWith("/login") ||
            currentPath.startsWith("/signup") ||
            currentPath.startsWith("/forgot-password") ||
            currentPath.startsWith("/verify") ||
            currentPath.startsWith("/mcp-auth");

          if (!isPublicRoute) {
            const redirect = window.location.pathname + window.location.search;
            window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
          }
        }
      }
    }
    return Promise.reject(error);
  },
);
