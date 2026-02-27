import { db } from '@/app/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
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