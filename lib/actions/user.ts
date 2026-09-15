import { db, storage, auth } from "@/lib/config/firebaseConfig";
import { doc, setDoc, updateDoc} from "firebase/firestore";
import type { UserParams } from "@/lib/services/user";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";


type UserParamKey = keyof UserParams;

type SetUserParamsArgs<K extends UserParamKey> = {
  param: K;
  value: UserParams[K];
  userId?: string;
};

export async function setUserParams<K extends UserParamKey>({ param, value, userId }: SetUserParamsArgs<K>) {
  if (!userId) {
    console.error("setUserParams: userId is missing");
    return;
  }

  const userRef = doc(db, "users", userId);

  await setDoc(userRef, { [param]: value }, { merge: true });
}

interface UpdateProfileData {
  displayName?: string;
  height?: number;
  avatarFile?: File | null;
}

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileData
) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  let avatarUrl = currentUser.photoURL || "";

  if (data.avatarFile) {
    const storageRef = ref(storage, `avatars/${userId}/${data.avatarFile.name}`);
    await uploadBytes(storageRef, data.avatarFile);
    avatarUrl = await getDownloadURL(storageRef);
  }

  await updateProfile(currentUser, {
    displayName: data.displayName ?? currentUser.displayName,
    ...(data.avatarFile && { photoURL: avatarUrl }),
  });

  const userDocRef = doc(db, "users", userId);
  
  const updateData: Record<string, any> = {};

  if (data.avatarFile) updateData.avatarUrl = avatarUrl;
  if (data.displayName !== undefined) updateData.displayName = data.displayName;
  if (data.height !== undefined) updateData.height = data.height;

  if (Object.keys(updateData).length > 0) {
    await updateDoc(userDocRef, updateData);
  }
};