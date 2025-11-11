export function ExerciseCard() {
  return (
    <div className="flex flex-col rounded-md bg-panel">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex gap-1">
          <span className="px-2 bg-primary-1 rounded-4xl text-sm font-medium">Body weight</span>
        </div>
        <div className="flex gap-1">
          <span className="px-2 bg-primary-1/50 rounded-4xl text-sm font-medium text-primary-2">Waist</span>
          <span className="px-2 bg-primary-1/50 rounded-4xl text-sm font-medium text-primary-2">Chest</span>
        </div>
      </div>
      <div className="h-40 bg-white">//Image</div>
      <div className="flex flex-col gap-1 p-4">
        <p className="text-xl font-bold">Push Up</p>
        <p className="text-md">A basic push-up exercise for chest and arms.</p>
        <p className="text-sm text-gray-400">60 exercise.time.per.set</p>
        <p className="text-sm text-gray-400 ml-auto">300 exercise.calories.per.set</p>
      </div>
    </div>
  );
}
