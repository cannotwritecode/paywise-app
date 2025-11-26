import { create } from "zustand";
import API from "@/src/services/api";
import { setAuthToken, clearAuthTokens } from "@/src/services/storage";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  login: async (email, password) => {
    set({ loading: true });
    const { data } = await API.post("/auth/login", { email, password });
    await setAuthToken(data.token, data.refreshToken);
    set({ user: data.user, loading: false });
  },
  logout: async () => {
    await clearAuthTokens();
    set({ user: null });
  },
}));
