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
    if (!resolvedTheme) return;

    const isDark = resolvedTheme === "dark";
    const themeColor = isDark ? "#020202" : "#ffffff";
    const faviconHref = isDark ? "/favicon-dark.svg" : "/favicon-light.svg";

    const existingIcon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (existingIcon) {
      existingIcon.href = faviconHref;
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = faviconHref;
      document.head.appendChild(link);
    }

    let metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", themeColor);
  }, [resolvedTheme]);

  return null;
}