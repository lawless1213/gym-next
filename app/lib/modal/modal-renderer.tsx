'use client'
import { useModal } from './modal-store'
import { AuthModal } from '@/app/components/modals/auth/auth-modal'

const MODAL_MAP = {
  auth: AuthModal,
} satisfies Record<string, React.ComponentType>

export function ModalRenderer() {
  const { type } = useModal()
  if (!type) return null
  const Modal = MODAL_MAP[type]
  return <Modal />
}