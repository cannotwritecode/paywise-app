import { create } from "zustand"
import type { AuthState, User } from "../types"

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => set({ token }),

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  },

  hydrate: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        set({ token })
      }
    }
  },
}))
