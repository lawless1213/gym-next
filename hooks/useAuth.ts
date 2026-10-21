"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";

/** Current Firebase user and auth actions. Requires `<AuthProvider>` (app/layout.tsx). */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
