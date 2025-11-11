import { ExerciseCard } from "@/app/ui/cards/exercise";


export default function Settings() {
  return (
    <>
      <h1 className="page_title">Exercises Page</h1>
      <div className="grid grid-cols-4 gap-2 mb-2">
        <ExerciseCard />
      </div>
    </>
  );
}
