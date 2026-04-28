// app/components/AppShell.tsx — новий клієнтський компонент
"use client";

import { AnimatePresence } from "motion/react";
import { useAuth } from "@/app/hooks/useAuth";
import LoadingScreen from "../LoadingScreen";
import { BottomNav } from "../bottomNav";

export default function AppShell({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  const { loading } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" />
      ) : (
        <div key="app" className="flex min-h-screen flex-col">
          <BottomNav />
          <main className="flex-1 overflow-hidden p-4 pb-24">{children}</main>
          {modal}
        </div>
      )}
    </AnimatePresence>
  );
}
