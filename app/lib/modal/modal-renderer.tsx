'use client'
import { RoutineCreateModal } from '@/app/components/modals/routine';
import { useModal } from './modal-store'
import { AuthModal } from '@/app/components/modals/auth'
import { ExerciseCreateModal } from '@/app/components/modals/exercise';
import { WorkoutModal } from '@/app/components/modals/workout';

const MODAL_MAP = {
  auth: AuthModal,
  exercise: ExerciseCreateModal,
  routine: RoutineCreateModal,
  workout: WorkoutModal,
} as const;
export type ModalType = keyof typeof MODAL_MAP;

export function ModalRenderer() {
  const { type } = useModal()
  if (!type) return null
  const Modal = MODAL_MAP[type]
  return <Modal />
}