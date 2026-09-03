"use client";

import { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getUserParams, type UserParams } from "@/lib/services/user";
import { setUserParams } from "@/lib/actions/user";
import { useAuth } from "@/hooks/useAuth";
import { useUserParams } from "@/hooks/useServices/useUserParams";

const defaultUserParams: UserParams = {
  theme: "system",
  language: "en",
  gender: "male",
  distance: "cm",
  weight: "kg",
};

type UserPreferencesContextValue = {
  params: UserParams;
  isLoading: boolean;
  updateParam: <K extends keyof UserParams>(param: K, value: UserParams[K]) => Promise<void>;
};

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useUserParams();

  const params: UserParams = {
    ...defaultUserParams,
    ...data,
  };

  async function updateParam<K extends keyof UserParams>(param: K, value: UserParams[K]) {
    if (!user?.uid) return;

    await setUserParams({
      param,
      value,
      userId: user.uid,
    });

    queryClient.setQueryData(["userParams", user.uid], (old: UserParams | undefined) => ({
      ...defaultUserParams,
      ...old,
      [param]: value,
    }));
  }

  return <UserPreferencesContext.Provider value={{ params, isLoading, updateParam }}>{children}</UserPreferencesContext.Provider>;
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);

  if (!context) {
    throw new Error("useUserPreferences must be used within UserPreferencesProvider");
  }

  return context;
}
