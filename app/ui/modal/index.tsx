"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { IconX } from "@tabler/icons-react";

type ModalType = {
  title?: string;
  children?: React.ReactNode;
  classes?: string;
  loading?: boolean;
  size?: 'default' | 'large';
};

type ModalProps = {
  modal: ModalType;
};

export function Modal({ modal }: ModalProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center backdrop-blur-sm z-10"
      onClick={handleClose}>
      <div
        className={clsx("flex flex-col rounded-md bg-background  max-w-screen overflow-hidden", modal.classes, {
          "w-[600px]": modal.size === 'default',
          "h-[90vh] w-[90vw]": modal.size === 'large',
        })}
        onClick={(e) => e.stopPropagation()}>
        <div className="p-4 flex gap-5 justify-between items-center">
          <h2 className="text-xl">{modal.title}</h2>
          <IconX
            size={26}
            stroke={2}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <div
          className={clsx("p-3 sm:p-8 m-4 mt-0 h-full rounded-md bg-white/10", {
            " animate-pulse": modal.loading,
          })}>
          {modal.loading ? <></> : modal.children}
        </div>
      </div>
    </div>
  );
}
