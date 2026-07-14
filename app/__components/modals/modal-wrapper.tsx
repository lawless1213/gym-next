// components/modals/modal-wrapper.tsx
"use client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useBodyScrollLock } from "@/app/hooks/useBodyScrollLock";
import { useModal } from "@/app/lib/modal/modal-store";
import clsx from "clsx";
import { IconX } from "@tabler/icons-react";
import { ModalType } from "@/app/lib/modal/modal-renderer";

type Props = {
  modalType: ModalType;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  header?: boolean;
  classes?: string;
  contentClasses?: string;
  size?: "default" | "large" | "high";
};

export function ModalWrapper({ modalType, children, classes, contentClasses, size = "default", title, header=true }: Props) {
  const { type, close } = useModal();
  const isOpen = type === modalType;
  useBodyScrollLock(isOpen);

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
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className={clsx("relative pointer-events-auto max-w-screen bg-card rounded-t-xl flex flex-col max-h-screen w-[600px]", classes, {
                "h-screen": size === "high",
                "sm:h-[95vh] sm:w-[90vw]": size === "large",
              })}>
              {
								header &&
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h2 className="text-xl font-bold text-foreground">{title}</h2>
                  <button
                    onClick={close}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground cursor-pointer hover:text-foreground"
                    aria-label="Close">
                    <IconX className="h-5 w-5" />
                  </button>
                </div>
              }
              <div 
								className={clsx("p-2 h-full overflow-y-auto sm:p-6", contentClasses)}>
								{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
