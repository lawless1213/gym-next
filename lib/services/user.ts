// lib/services/user.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";
import type { UserSubscription } from "@/types/subscribe";
import { toUserSubscription } from "@/lib/subscription";

export type UserParams = {
  theme: "light" | "dark" | "system";
  language: "en" | "uk";
  gender: "male" | "female";
  distance: "cm" | "in";
  weight: "kg" | "lb";
  height: number | null;
  avatarUrl: string | null;
  createdAt?: number | null;
  subscribed: UserSubscription;
};

export async function getUserParams(userId: string): Promise<Partial<UserParams>> {
  const snapshot = await getDoc(doc(db, "users", userId));

  if (!snapshot.exists()) {
    return {};
  }

  const { schedule, ...rest } = snapshot.data();

  return {
    ...rest,
    createdAt: rest.createdAt?.toMillis?.() ?? null,
    subscribed: toUserSubscription(rest.subscribed),
  } as Partial<UserParams>;
}
