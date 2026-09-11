"use client";

import clsx from "clsx";
import { forwardRef, useState } from "react";
import { Label } from "../label";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "../../Button";

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

export const Input = forwardRef<HTMLInputElement, InputProps>(({ input }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const { label, error, classes, icon, className, withoutError, ...rest } = input;

  const isPasswordInput = rest.type === "password";

  const inputType = isPasswordInput ? (isVisible ? "text" : "password") : (rest.type ?? "text");

  return (
    <div className="w-full">
      {label && <Label label={{ text: label, for: rest.id || "input" }} />}

      <div className="relative flex items-center">
        <input
          ref={ref}
          {...rest}
          id={rest.id || "input"}
          type={inputType}
          className={clsx("w-full rounded-xl bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", isPasswordInput && "pr-12", error && "ring-2 ring-red-500", classes, className)}
        />

        {isPasswordInput && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible((prev) => !prev)}
            className="absolute right-2 text-muted-foreground hover:text-foreground">
            {isVisible ? (
              <IconEyeOff
                stroke={1.5}
                className="size-5"
              />
            ) : (
              <IconEye
                stroke={1.5}
                className="size-5"
              />
            )}
          </Button>
        )}
      </div>

      {!withoutError && <p className="text-xs text-red-500 min-h-5 pl-3 pt-0.5">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
