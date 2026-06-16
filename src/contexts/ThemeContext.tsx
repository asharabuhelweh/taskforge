import { useState, useCallback, useMemo } from "react";
import { type ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "../styles/theme";
import { loadFromStorage, saveToStorage } from "../utils/persist";
import { ThemeContext } from "./theme-context";

const THEME_KEY = "taskforge_theme";

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">(
    () => loadFromStorage<"light" | "dark">(THEME_KEY, "light")
  );

  const toggleTheme = useCallback(() => {
    setMode((currentMode) => {
      const newMode = currentMode === "light" ? "dark" : "light";
      saveToStorage(THEME_KEY, newMode);
      return newMode;
    });
  }, []);


  const theme = mode === "light" ? lightTheme : darkTheme;
  const contextValue = useMemo(() => ({ toggleTheme }), [toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
