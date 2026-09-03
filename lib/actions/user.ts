import { db } from "@/lib/config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

interface userParamsProps {
  param: "theme" | "language" | "gender" | "distance" | "weight";
  value: string;
  userId?: string;
}

export async function setUserParams({ param, value, userId }: userParamsProps) {
  if (!userId) {
    console.error("setUserParams: userId is missing");
    return;
  }

  console.log(param + "-" + value);
  const userRef = doc(db, "users", userId);

  await setDoc(userRef, { [param]: value }, { merge: true });
}
