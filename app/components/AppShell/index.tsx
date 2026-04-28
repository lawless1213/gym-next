// app/components/AppShell.tsx — новий клієнтський компонент
"use client";

import { AnimatePresence, motion } from "motion/react";
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
        <motion.div
          key="app"
          className="flex min-h-screen flex-col"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}>
          <BottomNav />
          <main className="flex-1 overflow-hidden p-4 pb-24">{children}</main>
          {modal}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
