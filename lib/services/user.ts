// lib/services/user.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/config/firebaseConfig";

export type UserParams = {
  theme: "light" | "dark" | "system";
  language: "en" | "uk";
  gender: "male" | "female";
  distance: "cm" | "in";
  weight: "kg" | "lb";
};

export async function getUserParams(
  userId: string,
): Promise<Partial<UserParams>> {
  const snapshot = await getDoc(doc(db, "users", userId));

  if (!snapshot.exists()) {
    return {};
  }

  return snapshot.data() as Partial<UserParams>;
}