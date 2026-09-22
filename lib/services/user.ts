// lib/services/user.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";

export type UserParams = {
  theme: "light" | "dark" | "system";
  language: "en" | "uk";
  gender: "male" | "female";
  distance: "cm" | "in";
  weight: "kg" | "lb";
  height: number | null;
  avatarUrl: string | null;
  subscribe: boolean | null;
  createdAt: number | null; 
};

export async function getUserParams(
  userId: string,
): Promise<Partial<UserParams>> {
  const snapshot = await getDoc(doc(db, "users", userId));

  if (!snapshot.exists()) {
    return {};
  }

  const { schedule, ...rest } = snapshot.data();

  return {
    ...rest,
    createdAt: rest.createdAt?.toMillis?.() ?? null,
  } as Partial<UserParams>;
}