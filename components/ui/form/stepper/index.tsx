"use client";
import clsx from "clsx";
import { forwardRef } from "react";

type InputType = {
  placeholder?: string;
  icon?: React.ReactNode;
  classes?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
};

type InputProps = {
  input: InputType;
};

export const Stepper = forwardRef<HTMLInputElement, InputProps>(({ input }, _ref) => {
  return (
    <>
      <div>
        {input.label && (
          <label
            htmlFor={input.id || "input"}
            className="mb-1 block text-sm font-medium text-foreground">
            {input.label}
          </label>
        )}
        <input
          ref={_ref}
          id={input.id || "input"}
          name={input.name}
          type={input.type || "text"}
          value={input.value}
          onChange={input.onChange}
          onBlur={input.onBlur}
          placeholder={input.placeholder}
          className={clsx(
            "w-full rounded-xl bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none",
            input.error && "ring-2 ring-red-500",
            input.classes,
          )}
        />
        <p className="min-h-[20px] text-xs text-red-500">{input.error}</p>
      </div>
    </>
  );
});

Stepper.displayName = "Input";
