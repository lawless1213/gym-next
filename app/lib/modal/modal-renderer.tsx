'use client'
import { RoutineCreateModal } from '@/app/__components/modals/routine';
import { useModal } from './modal-store'
import { AuthModal } from '@/app/__components/modals/auth'
import { ExerciseCreateModal } from '@/app/__components/modals/exercise';
import { WorkoutModal } from '@/app/__components/modals/workout';
import { ScheduleEditModal } from '@/app/__components/modals/schedule';

const MODAL_MAP = {
  auth: AuthModal,
  exercise: ExerciseCreateModal,
  routine: RoutineCreateModal,
  workout: WorkoutModal,
  schedule: ScheduleEditModal,
} as const;
export type ModalType = keyof typeof MODAL_MAP;

export function ModalRenderer() {
  const { type } = useModal()
  if (!type) return null
  const Modal = MODAL_MAP[type]
  return <Modal />
}