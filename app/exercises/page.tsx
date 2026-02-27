import { getExercises } from '@/app/lib/services/exercises';
import { ExerciseCard } from "@/app/ui/cards/exercise";

export default async function Settings() {
  const exercises = await getExercises();

  return (
    <>
      <h1 className="page_title">Exercises Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-2">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </>
  );
}
