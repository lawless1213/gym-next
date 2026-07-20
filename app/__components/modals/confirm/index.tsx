"use client";

import { Button } from "@/app/__components/buttons/button";

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  children?: React.ReactNode;
};

type Props = ConfirmOptions & {
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  title,
  description,
  confirmLabel = "Підтвердити",
  cancelLabel = "Скасувати",
  variant = "default",
  
  children,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-200 backdrop-blur-xs flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative z-10 bg-card border border-border rounded-xl p-6 shadow-xl max-w-xl w-full mx-4">
        {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            size="lg"
            className={`w-full ${
              variant === "danger"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}>
            {confirmLabel}
          </Button>
          <Button
            onClick={onCancel}
            size="lg"
            variant="outline"
            className="w-full">
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
