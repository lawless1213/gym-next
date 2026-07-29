"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { Label } from "../label";

// 1. Розширюємо стандартні атрибути HTML-інпута
type InputType = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  classes?: string;
  icon?: React.ReactNode;
};

type InputProps = {
  input: InputType;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ input }, ref) => {
    const { label, error, classes, icon, className, ...rest } = input;

    return (
      <div className="w-full">
        {label && <Label label={{ text: label, for: rest.id || "input" }} />}
        
        <input
          ref={ref}
          id={rest.id || "input"}
          type={rest.type || "text"}
          className={clsx(
            "w-full rounded-xl bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
            error && "ring-2 ring-red-500",
            classes,
            className
          )}
          {...rest}
        />
        
        <p className="text-xs text-red-500 min-h-[20px]">{error}</p>
      </div>
    );
  }
);

Input.displayName = "Input";