"use client";
import clsx from "clsx";

type InputType = {
  placeholder?: string;
  icon?: React.ReactNode;
  classes?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
};

type InputProps = {
  input: InputType;
};

export function Input({ input }: InputProps) {
  return (
    <>
      <div className="space-y-2">
        {input.label && <label htmlFor={input.id || "input"} className="text-sm font-medium text-foreground">
          {input.label}
        </label>}
        <input
          id={input.id || "input"}
          type={input.type || "text"}
          value={input.value}
          onChange={input.onChange}
          placeholder={input.placeholder}
          className="w-full rounded-xl bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <p className="text-xs text-red-500 mt-1 min-h-[20px]">{input.error}</p>
    </>
  );
}
