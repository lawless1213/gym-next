import { db } from "@/lib/config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import type { UserParams } from "@/lib/services/user";

type UserParamKey = keyof UserParams;

type SetUserParamsArgs<K extends UserParamKey> = {
  param: K;
  value: UserParams[K];
  userId?: string;
};

export async function setUserParams<K extends UserParamKey>({
  param,
  value,
  userId,
}: SetUserParamsArgs<K>) {
  if (!userId) {
    console.error("setUserParams: userId is missing");
    return;
  }

  const userRef = doc(db, "users", userId);

  await setDoc(userRef, { [param]: value }, { merge: true });
}
