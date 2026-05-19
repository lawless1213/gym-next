'use client'
import { createContext, useContext, useState } from 'react'
import { ModalRenderer, ModalType } from './modal-renderer'

type ModalStore = {
  type: ModalType | null;
  open: (type: ModalType) => void;
  close: () => void;
};

const ModalContext = createContext<ModalStore | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState<ModalType | null>(null);

  return (
    <ModalContext.Provider value={{
      type,
      open: setType,
      close: () => setType(null),
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