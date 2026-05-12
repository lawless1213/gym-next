// components/modals/modal-wrapper.tsx
"use client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useModal } from "@/app/lib/modal/modal-store";
import { ModalType } from "@/app/types/modal";
import clsx from "clsx";
import { IconX } from "@tabler/icons-react";

type Props = {
  modalType: ModalType;
  children: React.ReactNode;
  title?: string;
  classes?: string;
  size?: "default" | "large";
};

export function ModalWrapper({ modalType, children, classes, size = "default", title }: Props) {
  const { type, close } = useModal();
  const isOpen = type === modalType;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
          />
          <div
            className="fixed inset-0 z-50 flex justify-center items-end pointer-events-none"
            onClick={close}>
            <motion.div
              key="modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 16 }}
              transition={{
								type: 'spring',
								stiffness: 400,
								damping: 30,
							}}
              className={clsx("pointer-events-auto max-w-screen bg-secondary rounded-t-xl flex flex-col overflow-hidden", classes, {
                "w-[600px]": size === "default",
                "h-[90vh] w-[90vw]": size === "large",
              })}>
              <div className="p-4 flex gap-5 justify-between items-center">
                <h2 className="text-xl">{title}</h2>
                <IconX
                  size={26}
                  stroke={2}
                  className="cursor-pointer"
                  onClick={close}
                />
              </div>
              <div className={clsx("p-3 sm:p-8 m-4 mt-0 h-full")}>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
