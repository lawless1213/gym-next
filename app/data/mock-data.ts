import { Exercise, Workout, Routine, PersonalRecord, BodyMeasurement } from '../types';

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    description: 'Compound chest exercise targeting pectorals, deltoids, and triceps',
    muscleGroup: 'Chest',
    imageUrl: '/exercises/bench-press.jpg',
    isCustom: false,
  },
  {
    id: '2',
    name: 'Barbell Squat',
    description: 'Compound leg exercise targeting quadriceps, glutes, and hamstrings',
    muscleGroup: 'Legs',
    imageUrl: '/exercises/squat.jpg',
    isCustom: false,
  },
  {
    id: '3',
    name: 'Deadlift',
    description: 'Compound full-body exercise targeting back, glutes, and hamstrings',
    muscleGroup: 'Back',
    imageUrl: '/exercises/deadlift.jpg',
    isCustom: false,
  },
  {
    id: '4',
    name: 'Overhead Press',
    description: 'Compound shoulder exercise targeting deltoids and triceps',
    muscleGroup: 'Shoulders',
    imageUrl: '/exercises/ohp.jpg',
    isCustom: false,
  },
  {
    id: '5',
    name: 'Barbell Row',
    description: 'Compound back exercise targeting lats, rhomboids, and biceps',
    muscleGroup: 'Back',
    imageUrl: '/exercises/row.jpg',
    isCustom: false,
  },
  {
    id: '6',
    name: 'Pull-ups',
    description: 'Bodyweight back exercise targeting lats and biceps',
    muscleGroup: 'Back',
    imageUrl: '/exercises/pullup.jpg',
    isCustom: false,
  },
  {
    id: '7',
    name: 'Dumbbell Curl',
    description: 'Isolation exercise targeting biceps brachii',
    muscleGroup: 'Arms',
    imageUrl: '/exercises/curl.jpg',
    isCustom: false,
  },
  {
    id: '8',
    name: 'Tricep Dips',
    description: 'Compound exercise targeting triceps and chest',
    muscleGroup: 'Arms',
    imageUrl: '/exercises/dips.jpg',
    isCustom: false,
  },
  {
    id: '9',
    name: 'Custom Calf Raises',
    description: 'Standing calf raise variation with pause at top',
    muscleGroup: 'Legs',
    imageUrl: '/exercises/calf.jpg',
    isCustom: true,
  },
];

export const routines: Routine[] = [
  {
    id: '1',
    name: 'Push Day',
    exercises: [exercises[0], exercises[3], exercises[7]],
    color: '#CCFF00',
  },
  {
    id: '2',
    name: 'Pull Day',
    exercises: [exercises[2], exercises[4], exercises[5], exercises[6]],
    color: '#2563EB',
  },
  {
    id: '3',
    name: 'Leg Day',
    exercises: [exercises[1], exercises[8]],
    color: '#F97316',
  },
];

export const currentWorkout: Workout = {
  id: 'workout-1',
  name: 'Push Day',
  date: new Date().toISOString(),
  completed: false,
  exercises: [
    {
      id: 'we-1',
      exercise: exercises[0],
      sets: [
        { id: 's1', weight: 80, reps: 8, completed: true, lastWeight: 77.5, lastReps: 8 },
        { id: 's2', weight: 85, reps: 6, completed: true, lastWeight: 80, lastReps: 7 },
        { id: 's3', weight: 85, reps: 0, completed: false, lastWeight: 80, lastReps: 6 },
        { id: 's4', weight: 0, reps: 0, completed: false, lastWeight: 75, lastReps: 8 },
      ],
    },
    {
      id: 'we-2',
      exercise: exercises[3],
      sets: [
        { id: 's5', weight: 50, reps: 0, completed: false, lastWeight: 47.5, lastReps: 8 },
        { id: 's6', weight: 0, reps: 0, completed: false, lastWeight: 47.5, lastReps: 7 },
        { id: 's7', weight: 0, reps: 0, completed: false, lastWeight: 45, lastReps: 8 },
      ],
    },
    {
      id: 'we-3',
      exercise: exercises[7],
      sets: [
        { id: 's8', weight: 0, reps: 0, completed: false, lastWeight: 0, lastReps: 12 },
        { id: 's9', weight: 0, reps: 0, completed: false, lastWeight: 0, lastReps: 10 },
        { id: 's10', weight: 0, reps: 0, completed: false, lastWeight: 0, lastReps: 8 },
      ],
    },
  ],
};

export const personalRecords: PersonalRecord[] = [
  { id: 'pr-1', exerciseId: '1', exerciseName: 'Barbell Bench Press', weight: 100, reps: 1, date: '2026-03-15' },
  { id: 'pr-2', exerciseId: '2', exerciseName: 'Barbell Squat', weight: 140, reps: 1, date: '2026-03-20' },
  { id: 'pr-3', exerciseId: '3', exerciseName: 'Deadlift', weight: 180, reps: 1, date: '2026-04-01' },
  { id: 'pr-4', exerciseId: '4', exerciseName: 'Overhead Press', weight: 65, reps: 1, date: '2026-03-25' },
  { id: 'pr-5', exerciseId: '5', exerciseName: 'Barbell Row', weight: 90, reps: 5, date: '2026-04-05' },
];

export const bodyMeasurements: BodyMeasurement[] = [
  { id: 'm1', date: '2026-01-01', weight: 82, waist: 86, chest: 102, arms: 36, thighs: 58 },
  { id: 'm2', date: '2026-01-15', weight: 81.5, waist: 85, chest: 102, arms: 36.5, thighs: 58 },
  { id: 'm3', date: '2026-02-01', weight: 81, waist: 84, chest: 103, arms: 37, thighs: 59 },
  { id: 'm4', date: '2026-02-15', weight: 80.5, waist: 83, chest: 103, arms: 37, thighs: 59 },
  { id: 'm5', date: '2026-03-01', weight: 80, waist: 82, chest: 104, arms: 37.5, thighs: 60 },
  { id: 'm6', date: '2026-03-15', weight: 79.5, waist: 81, chest: 104, arms: 38, thighs: 60 },
  { id: 'm7', date: '2026-04-01', weight: 79, waist: 80, chest: 105, arms: 38, thighs: 61 },
];

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const workoutSchedule: Record<string, string | null> = {
  'Mon': 'Push Day',
  'Tue': 'Pull Day',
  'Wed': null,
  'Thu': 'Leg Day',
  'Fri': 'Push Day',
  'Sat': 'Pull Day',
  'Sun': null,
};
