'use client'
import { createContext, useContext, useState } from 'react'
import { ModalRenderer, ModalType } from './modal-renderer'

type ModalStore = {
  type: ModalType | null;
  data: unknown;
  open: (type: ModalType, data?: unknown) => void;
  close: () => void;
};

const ModalContext = createContext<ModalStore | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<{ type: ModalType | null; data: unknown }>({
    type: null,
    data: null,
  });

  return (
    <ModalContext.Provider value={{
      type: modal.type,
      data: modal.data,
      open: (type, data) => setModal({ type, data }),
      close: () => setModal({ type: null, data: null }),
    }}>
      {children}
      <ModalRenderer />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}