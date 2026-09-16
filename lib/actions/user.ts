import { db, storage, auth } from "@/lib/config/firebaseConfig";
import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import type { UserParams } from "@/lib/services/user";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
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
    const storageRef = ref(storage, `users/${userId}/${data.avatarFile.name}`);
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
    // Замість updateDoc використовуємо setDoc з { merge: true }
    // Це створить документ, якщо його ще не було у Firestore, або оновить існуючий
    await setDoc(userDocRef, updateData, { merge: true });
  }
};

// Допоміжна функція: рекурсивне видалення папки в Storage
async function deleteStorageFolder(path: string) {
  const folderRef = ref(storage, path);
  const res = await listAll(folderRef);

  const deleteFilesPromises = res.items.map((itemRef) => deleteObject(itemRef));
  const deleteSubFoldersPromises = res.prefixes.map((prefixRef) =>
    deleteStorageFolder(prefixRef.fullPath)
  );

  await Promise.all([...deleteFilesPromises, ...deleteSubFoldersPromises]);
}

// Функція видалення всіх даних користувача (Firestore + Storage)
export async function deleteUserData(userId: string) {
  const subcollections = ["exercises", "routines", "stats"];
  
  for (const subcol of subcollections) {
    const subColRef = collection(db, "users", userId, subcol);
    const snapshot = await getDocs(subColRef);
    
    if (!snapshot.empty) {
      const batch = writeBatch(db);
      snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
      await batch.commit();
    }
  }

  const userDocRef = doc(db, "users", userId);
  await deleteDoc(userDocRef);

  try {
    await deleteStorageFolder(`users/${userId}`);
  } catch (error) {
    console.error("Помилка видалення файлів зі Storage:", error);
  }
}