"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { ModalRenderer, ModalType } from "./modal-renderer";
import { ConfirmModal, ConfirmOptions } from "@/app/__components/modals/confirm";

type ModalStore = {
  type: ModalType | null;
  data: unknown;
  open: (type: ModalType, data?: unknown) => void;
  close: () => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

type ConfirmState = (ConfirmOptions & {
  resolve: (value: boolean) => void;
}) | null;

const ModalContext = createContext<ModalStore | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<{ type: ModalType | null; data: unknown }>({
    type: null,
    data: null,
  });

  const [confirmState, setConfirmState] = useState<ConfirmState>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  const handleConfirmClose = useCallback(
    (value: boolean) => {
      confirmState?.resolve(value);
      setConfirmState(null);
    },
    [confirmState],
  );

  return (
    <ModalContext.Provider
      value={{
        type: modal.type,
        data: modal.data,
        open: (type, data) => setModal({ type, data }),
        close: () => setModal({ type: null, data: null }),
        confirm,
      }}>
      {children}
      <ModalRenderer />
      {confirmState && (
        <ConfirmModal
          {...confirmState}
          onConfirm={() => handleConfirmClose(true)}
          onCancel={() => handleConfirmClose(false)}
        />
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
