import { create } from "zustand";
import { loadFromStorage, saveToStorage, removeFromStorage } from "../../utils/persist.ts";

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const SESSION_KEY = "taskforge_session";

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: loadFromStorage<boolean>(SESSION_KEY, false),

  login: (email, password) => {
    if (email !== "admin@test.com" || password !== "22334455") {
      return false;
    }

    saveToStorage(SESSION_KEY, true);
    set({ isAuthenticated: true });
    return true;
  },

  logout: () => {
    removeFromStorage(SESSION_KEY);
    set({ isAuthenticated: false });
  },
}));
