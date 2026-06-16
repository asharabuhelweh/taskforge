import { createContext } from "react";

interface ThemeContextValue {
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  toggleTheme: () => undefined,
});
