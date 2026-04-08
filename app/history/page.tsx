'use client';

import { IconCalendarWeekFilled, IconClock, IconBarbell, IconTrendingUp} from '@tabler/icons-react';

const workoutHistory = [
  {
    id: '1',
    name: 'Push Day',
    date: {
			month: "Apr",
			value: 7,
		},
    duration: 52,
    exercises: 4,
    volume: 8450,
    prs: 1,
  },
  {
    id: '2',
    name: 'Pull Day',
    date: {
			month: "Apr",
			value: 4,
		},
    duration: 58,
    exercises: 6,
    volume: 9200,
    prs: 0,
  },
  {
    id: '3',
    name: 'Leg Day',
    date: {
			month: "Apr",
			value: 5,
		},
    duration: 65,
    exercises: 5,
    volume: 12800,
    prs: 2,
  },
  {
    id: '4',
    name: 'Push Day',
    date: {
			month: "Apr",
			value: 6,
		},
    duration: 48,
    exercises: 4,
    volume: 8100,
    prs: 0,
  },
  {
    id: '5',
    name: 'Pull Day',
    date: {
			month: "Apr",
			value: 3,
		},
    duration: 55,
    exercises: 5,
    volume: 8900,
    prs: 1,
  },
];

export default function History() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">Your workout journey</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendarWeekFilled className="h-4 w-4" />
            <span className="text-sm">This Week</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">5</p>
          <p className="text-xs text-muted-foreground">workouts</p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconTrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm">Volume</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">47.5K</p>
          <p className="text-xs text-muted-foreground">kg this week</p>
        </div>
      </div>

      {/* Workout List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Recent Workouts</h2>
        {workoutHistory.map((workout) => (
          <button
            key={workout.id}
            className="flex w-full items-center gap-4 rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary"
          >
            {/* Date Badge */}
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-secondary">
              <span className="text-xs font-medium text-muted-foreground">
                {workout.date.month}
              </span>
							<span className="text-lg font-bold text-foreground">
								{workout.date.value}
							</span>
            </div>

            {/* Workout Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{workout.name}</h3>
                {workout.prs > 0 && (
                  <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {workout.prs} PR{workout.prs > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <IconClock className="h-3.5 w-3.5" />
                  {workout.duration}m
                </span>
                <span className="flex items-center gap-1">
                  <IconBarbell className="h-3.5 w-3.5" />
                  {workout.exercises} exercises
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {(workout.volume / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-muted-foreground">kg</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
