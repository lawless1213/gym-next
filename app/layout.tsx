import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import ThemeColorSync, { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import AppShell from "@/components/shared/AppShell";
import { ModalProvider } from "@/components/modals/ModalProvider";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { UserPreferencesProvider } from "@/providers/UserPreferencesProvider";
import { CookieBanner } from "@/components/shared/CookieBanner";

// Body text.
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

// Display: logo, loading screen, page titles (`font-display`).
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
  variable: "--font-unbounded",
  display: "swap",
});

export const viewport: Viewport = {
  // Initial colour before hydration; ThemeColorSync syncs it with the chosen theme.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#060605" },
  ],
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");

  return {
    // Pages set their own title (app/*/page.tsx) → "Stats · NextForma".
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("subtitle"),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: t("title"),
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${unbounded.variable} flex min-h-screen flex-col bg-background font-sans antialiased`}>
        <ThemeProvider>
          <ThemeColorSync />
          <NextIntlClientProvider>
            <CookieBanner />
            <AuthProvider>
              <QueryProvider>
                <UserPreferencesProvider>
                  <ModalProvider>
                    <TooltipProvider delayDuration={200}>
                      <AppShell>{children}</AppShell>
                    </TooltipProvider>
                  </ModalProvider>
                </UserPreferencesProvider>
              </QueryProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
