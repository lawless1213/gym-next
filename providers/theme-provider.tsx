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

    // The layout renders one meta per prefers-color-scheme. The user may pick a theme that
    // differs from the OS one, so drop the media query and force the chosen colour on all of them.
    const metas = document.querySelectorAll<HTMLMetaElement>("meta[name='theme-color']");
    if (metas.length === 0) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = themeColor;
      document.head.appendChild(meta);
    }
    metas.forEach((meta) => {
      meta.removeAttribute("media");
      meta.content = themeColor;
    });
  }, [resolvedTheme]);

  return null;
}