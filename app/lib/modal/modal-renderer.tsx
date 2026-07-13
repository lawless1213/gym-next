'use client'
import { RoutineCreateModal } from '@/app/__components/modals/routine/create';
import { useModal } from './modal-store'
import { AuthModal } from '@/app/__components/modals/auth'
import { ExerciseCreateModal } from '@/app/__components/modals/exercise/create';
import { WorkoutModal } from '@/app/__components/modals/workout';
import { ScheduleEditModal } from '@/app/__components/modals/schedule';
import { ProgressModal } from '@/app/__components/modals/progress';
import { ExerciseEditModal } from '@/app/__components/modals/exercise/edit';
import { RoutineEditModal } from '@/app/__components/modals/routine/edit';
import { QuickWorkoutModal } from '@/app/__components/modals/workout/quickWorkout';

const MODAL_MAP = {
  auth: AuthModal,
  exercise: ExerciseCreateModal,
  exerciseEdit: ExerciseEditModal,
  routine: RoutineCreateModal,
  routineEdit: RoutineEditModal,
  workout: WorkoutModal,
  quickWorkout: QuickWorkoutModal,
  schedule: ScheduleEditModal,
  progress: ProgressModal,
} as const;
export type ModalType = keyof typeof MODAL_MAP;

export function ModalRenderer() {
  const { type } = useModal()
  if (!type) return null
  const Modal = MODAL_MAP[type]
  return <Modal />
}