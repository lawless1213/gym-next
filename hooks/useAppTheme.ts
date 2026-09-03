"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { setUserParams } from "@/lib/actions/user";
import { useAuth } from "./useAuth";
import { useUserPreferences } from "@/providers/user-preferences-provider";

export type AppTheme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

export function useAppTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { params, updateParam } = useUserPreferences();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme ?? "system") as AppTheme;
  const currentResolvedTheme = (resolvedTheme ?? "light") as ResolvedTheme;
  const isDark = currentResolvedTheme === "dark";

  const actions = useMemo(
    () => ({
      setTheme: (nextTheme: AppTheme) => {
        setTheme(nextTheme);
        updateParam("theme", nextTheme );
      },
      toggleTheme: () => {
        const nextTheme = isDark ? "light" : "dark";
        setTheme(nextTheme)
        updateParam("theme", nextTheme );
      },
    }),
    [isDark, setTheme],
  );

  return {
    theme: currentTheme,
    resolvedTheme: currentResolvedTheme,
    isDark,
    mounted,
    ...actions,
  };
}
