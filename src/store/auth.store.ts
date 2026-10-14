import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
};


type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  onboarding: {
    step: number;
    isCompleted: boolean;
  };
  loading: boolean;

  setUser: (user: User | null) => void;

  setOnboarding: (step: number, isCompleted:boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      onboarding: {
        step: 0,
        isCompleted: false,
      },
      isAuthenticated: false,
      loading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      setLoading: (loading) => set({ loading }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        }),
      setOnboarding: (step, isCompleted) =>
        set({
          onboarding: {
            step,
            isCompleted
          },
        }),
    }),
    { name: "auth-storage" },
  ),
);
