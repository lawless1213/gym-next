"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";

export type AppTheme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

export function useAppTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { updateParam } = useUserPreferences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only state after mount (SSR-safe)
    setMounted(true);
  }, []);

  const currentTheme = (theme ?? "system") as AppTheme;
  const currentResolvedTheme = (resolvedTheme ?? "light") as ResolvedTheme;
  const isDark = currentResolvedTheme === "dark";

  const actions = useMemo(
    () => ({
      setTheme: (nextTheme: AppTheme) => {
        setTheme(nextTheme);
        updateParam("theme", nextTheme);
      },
      toggleTheme: () => {
        const nextTheme = isDark ? "light" : "dark";
        setTheme(nextTheme);
        updateParam("theme", nextTheme);
      },
    }),
    [isDark, setTheme, updateParam],
  );

  return {
    theme: currentTheme,
    resolvedTheme: currentResolvedTheme,
    isDark,
    mounted,
    ...actions,
  };
}
