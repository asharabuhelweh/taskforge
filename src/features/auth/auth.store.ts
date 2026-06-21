import { create } from "zustand";
import {
  getAuthToken,
  removeAuthToken,
  saveAuthToken,
} from "../../utils/authToken";
import { loginRequest } from "../../utils/api";

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: Boolean(getAuthToken()),

  login: async (email, password) => {
    try {
      const { token } = await loginRequest(email, password);
      saveAuthToken(token);
      set({ isAuthenticated: true });
      return true;
    } catch {
      removeAuthToken();
      set({ isAuthenticated: false });
      return false;
    }
  },

  logout: () => {
    removeAuthToken();
    set({ isAuthenticated: false });
  },
}));
