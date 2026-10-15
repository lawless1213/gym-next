import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import FaviconSwitcher, { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/QueryProvider";
import AppShell from "@/components/shared/AppShell";
import { ModalProvider } from "@/components/modals/modal-store";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { UserPreferencesProvider } from "@/providers/user-preferences-provider";
import { CookieBanner } from "@/components/shared/CookieBanner";

const exo2 = Exo_2({
  subsets: ["latin", "cyrillic"],
  variable: "--font-exo2",
  display: "swap",
});

export const viewport: Viewport = {
  // Initial colour before hydration; FaviconSwitcher syncs it with the chosen theme.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020202" },
  ],
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");

  return {
    title: t("title"),
    description: t("subtitle"),
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
      <body className={`${exo2.variable} font-sans antialiased flex min-h-screen flex-col bg-background`}>
        <SpeedInsights />
        <ThemeProvider>
          <FaviconSwitcher />
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
