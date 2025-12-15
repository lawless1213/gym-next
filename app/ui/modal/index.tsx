"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { IconX } from "@tabler/icons-react";

type ModalType = {
  title?: string;
  children?: React.ReactNode;
  classes?: string,
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
      className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center backdrop-blur-sm"
      onClick={handleClose}>
      <div
        className={`flex flex-col rounded-md bg-background w-[600px] max-w-screen overflow-hidden ${modal.classes}`}
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
        <div className="p-8 m-4 mt-0 border border-dimmed rounded-md">{modal.children}</div>
      </div>
    </div>
  );
}
