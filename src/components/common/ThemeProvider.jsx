"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => null,
});

export function ThemeProvider({ children, defaultTheme = "dark", storageKey = "ui-theme" }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // Always set to dark mode
  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  }, []);

  const value = {
    theme,
    setTheme: (theme) => {
      if (mounted) {
        localStorage.setItem(storageKey, theme);
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}; 