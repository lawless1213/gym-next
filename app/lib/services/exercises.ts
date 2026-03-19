import { db } from '@/app/lib/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Exercise } from '@/app/types/exercise';

export async function getExercises(): Promise<Exercise[]> {
  const querySnapshot = await getDocs(collection(db, "exercises"));
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    
    return {
      ...data,
      id: doc.id, 
    } as Exercise;
  });
}

export async function getExercise(id: string): Promise<Exercise> {
  const docSnapshot = await getDoc(doc(db, "exercises", id));
  const data = docSnapshot.data();
  
  return data as Exercise;
}