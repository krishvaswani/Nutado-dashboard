"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = (localStorage.getItem("nutado-theme") as Theme) ?? "light";
    setThemeState(stored);
    applyTheme(stored);
  }, []);

  function applyTheme(t: Theme) {
    const isDark =
      t === "dark" ||
      (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("nutado-theme", t);
    applyTheme(t);
  }

  return { theme, setTheme };
}
