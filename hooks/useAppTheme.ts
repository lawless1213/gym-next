"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

type AppTheme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

export function useAppTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme ?? "system") as AppTheme;
  const currentResolvedTheme = (resolvedTheme ?? "light") as ResolvedTheme;
  const isDark = currentResolvedTheme === "dark";

  const actions = useMemo(
    () => ({
      setTheme: (nextTheme: AppTheme) => setTheme(nextTheme),
      toggleTheme: () => setTheme(isDark ? "light" : "dark"),
    }),
    [isDark, setTheme]
  );

  return {
    theme: currentTheme,
    resolvedTheme: currentResolvedTheme,
    isDark,
    mounted,
    ...actions,
  };
}
