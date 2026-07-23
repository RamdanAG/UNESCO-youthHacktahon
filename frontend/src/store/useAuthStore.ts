import { create } from "zustand";
import type { AuthResponse } from "@/services/authService";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (auth: AuthResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: null,
  userId: null,
  displayName: null,
  isAuthenticated: false,

  setAuth: (auth) =>
    set({
      accessToken: auth.access_token,
      userId: auth.user_id,
      displayName: auth.display_name,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      userId: null,
      displayName: null,
      isAuthenticated: false,
    }),
}));