import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./hooks/useAuth";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "../providers/theme-provider";
import { QueryProvider } from "../providers/QueryProvider";
import AppShell from "./__components/AppShell";
import { ModalProvider } from "@/components/modals/modal-store";
import { TooltipProvider } from "@/components/ui/Tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SpeedInsights />
      <html
        lang="en"
        suppressHydrationWarning>
        <body className={`${inter.variable} antialiased flex min-h-screen flex-col bg-background`}>
          <ThemeProvider>
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
    </>
  );
}