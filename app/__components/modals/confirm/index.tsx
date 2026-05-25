"use client";

import { ModalWrapper } from "../modal-wrapper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/app/__components/buttons/button";
import { Input } from "@/app/__components/form/input";
import { AUTH_ERRORS } from "@/app/lib/errors/auth";
import { useModal } from "@/app/lib/modal/modal-store";
import { IconBarbell, IconCheck, IconUpload } from "@tabler/icons-react";
import { useState } from "react";

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
};

type Props = ConfirmOptions & {
  onConfirm: () => void;
  onCancel: () => void;  // ← був відсутній
};

export function ConfirmModal({
  title,
  description,
  confirmLabel = 'Підтвердити',
  cancelLabel = 'Скасувати',
  variant = 'default',
  onConfirm,
  onCancel,
}: Props) {
  return (
    // ← НЕ ModalWrapper, бо це overlay поверх усього
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={onCancel} 
      />
      <div className="relative z-10 bg-card border border-border rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
        {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            size="lg"
            className={`w-full ${
              variant === 'danger'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
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