"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export default function FaviconSwitcher() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const href = resolvedTheme === "dark" ? "/favicon-dark.svg" : "/favicon-light.svg";
    const existing = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (existing) {
      existing.href = href;
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = href;
      document.head.appendChild(link);
    }
  }, [resolvedTheme]);

  return null;
}