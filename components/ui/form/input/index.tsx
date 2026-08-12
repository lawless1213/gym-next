"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { Label } from "../label";

type InputType = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  classes?: string;
  icon?: React.ReactNode;
  withoutError?: boolean;
};

type InputProps = {
  input: InputType;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ input }, ref) => {
    const { label, error, classes, icon, className, withoutError, ...rest } = input;

    return (
      <div className="w-full">
        {label && <Label label={{ text: label, for: rest.id || "input" }} />}
        
        <input
          ref={ref}
          id={rest.id || "input"}
          type={rest.type || "text"}
          className={clsx(
            "w-full rounded-xl bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            error && "ring-2 ring-red-500",
            classes,
            className
          )}
          {...rest}
        />
        
        { !withoutError && <p className="text-xs text-red-500 min-h-[20px]">{error}</p> }
      </div>
    );
  }
);

Input.displayName = "Input";