import { db, storage } from "@/lib/config/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, deleteDoc, getDocs, arrayRemove, writeBatch, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import type { LocalizedText } from "@/types/common";

function normalizeLocalizedText(value: string | LocalizedText | undefined): LocalizedText {
  if (!value) return { en: "", uk: "" };
  if (typeof value === "string") return { en: value, uk: value };
  return value;
}

export async function createUserExercise(
  userId: string,
  data: {
    photo?: File | string;
    title: string | LocalizedText;
    groups: string[];
    description: string | LocalizedText;
  },
) {
  let imageUrl: string | null = null;

  if (data.photo instanceof File) {
    const ext = data.photo.name.split(".").pop();
    const storageRef = ref(storage, `users/${userId}/exercises/${Date.now()}.${ext}`);
    const snapshot = await uploadBytes(storageRef, data.photo);
    imageUrl = await getDownloadURL(snapshot.ref);
  } else if (typeof data.photo === "string") {
    imageUrl = data.photo;
  }

  const exercisesRef = collection(db, "users", userId, "exercises");

  const docRef = await addDoc(exercisesRef, {
    name: data.title,
    muscleGroup: data.groups.join(", "),
    description: data.description,
    imageUrl,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, imageUrl };
}

export async function editUserExecise(
  userId: string,
  exerciseId: string,
  data: {
    photo?: File | string;
    title: string | LocalizedText;
    groups: string[];
    description: string | LocalizedText;
  },
) {
  let imageUrl: string | null = null;

  if (data.photo instanceof File) {
    const ext = data.photo.name.split(".").pop();
    const storageRef = ref(storage, `users/${userId}/exercises/${Date.now()}.${ext}`);
    const snapshot = await uploadBytes(storageRef, data.photo);
    imageUrl = await getDownloadURL(snapshot.ref);
  } else if (typeof data.photo === "string") {
    imageUrl = data.photo;
  }

  const exerciseRef = doc(db, "users", userId, "exercises", exerciseId);

  await updateDoc(exerciseRef, {
    name: normalizeLocalizedText(data.title),
    muscleGroup: data.groups.join(", "),
    description: normalizeLocalizedText(data.description),
    imageUrl,
  });

  return { id: exerciseId, imageUrl };
}

export async function deleteUserExercise(userId: string, exerciseId: string, imageUrl?: string | null) {
  if (imageUrl) {
    try {
      await deleteObject(ref(storage, imageUrl));
    } catch {
      console.log("Error during photo deletion");
    }
  }

  const exerciseRef = doc(db, "users", userId, "exercises", exerciseId);
  const routinesSnap = await getDocs(collection(db, "users", userId, "routines"));

  const batch = writeBatch(db);

  routinesSnap.docs
    .filter((routineDoc) => {
      const exercises = routineDoc.data().exercises ?? [];
      return exercises.some((r: any) => r.path === exerciseRef.path);
    })
    .forEach((routineDoc) => {
      batch.update(routineDoc.ref, { exercises: arrayRemove(exerciseRef) });
    });

  batch.delete(exerciseRef);

  await batch.commit();
}
