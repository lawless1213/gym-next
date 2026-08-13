'use client'
import { RoutineCreateModal } from '@/components/modals/routine/create';
import { useModal } from './modal-store'
import { AuthModal } from '@/components/modals/auth'
import { ExerciseCreateModal } from '@/components/modals/exercise/create';
import { WorkoutModal } from '@/components/modals/workout';
import { ScheduleEditModal } from '@/components/modals/schedule';
import { ProgressModal } from '@/components/modals/progress';
import { ExerciseEditModal } from '@/components/modals/exercise/edit';
import { RoutineEditModal } from '@/components/modals/routine/edit';
import { QuickWorkoutModal } from '@/components/modals/workout/quickWorkout';
import { AiModal } from '@/components/modals/AI';

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
  ai: AiModal,
} as const;
export type ModalType = keyof typeof MODAL_MAP;

export function ModalRenderer() {
  const { type } = useModal()
  if (!type) return null
  const Modal = MODAL_MAP[type]
  return <Modal />
}