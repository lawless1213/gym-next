import { db, storage } from "@/app/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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