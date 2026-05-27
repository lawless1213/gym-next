import { db, storage } from "@/app/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, deleteDoc, getDocs, arrayRemove, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export async function createUserExercise(
  userId: string,
  data: {
    photo?: File;
    title: string;
    groups: string[];
    description: string;
  }
) {
  let imageUrl: string | null = null;

  if (data.photo) {
    const ext = data.photo.name.split(".").pop();
    const storageRef = ref(storage, `users/${userId}/exercises/${Date.now()}.${ext}`);
    const snapshot = await uploadBytes(storageRef, data.photo);
    imageUrl = await getDownloadURL(snapshot.ref);
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

export async function deleteUserExercise(
  userId: string,
  exerciseId: string,
  imageUrl?: string | null
) {
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