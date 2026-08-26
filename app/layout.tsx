import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import FaviconSwitcher, { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/QueryProvider";
import AppShell from "@/components/shared/AppShell";
import { ModalProvider } from "@/components/modals/modal-store";
import { TooltipProvider } from "@/components/ui/Tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning>
      <body className={`${inter.variable} antialiased flex min-h-screen flex-col bg-background`}>
        <SpeedInsights />
        <ThemeProvider>
          <FaviconSwitcher />
          <NextIntlClientProvider>
            <AuthProvider>
              <QueryProvider>
                <ModalProvider>
                  <TooltipProvider delayDuration={200}>
                    <AppShell>{children}</AppShell>
                  </TooltipProvider>
                </ModalProvider>
              </QueryProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}