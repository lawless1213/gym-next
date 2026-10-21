"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}

export default function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    // Must match --background in globals.css. The favicon is the same in both themes (layout metadata).
    const themeColor = resolvedTheme === "dark" ? "#060605" : "#f7f8f3";

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
