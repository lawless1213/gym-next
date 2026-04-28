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
  error?: string;
};

type InputProps = {
  input: InputType;
};

export function Input({ input }: InputProps) {
  return (
    <>
      <div className="flex items-center rounded-md bg-white/5 outline-1 -outline-offset-1 outline-gray-600 has-[input:focus-within]:primary-1 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-primary-1">
        <input
          id={input.id || "input"}
          type={input.type || "text"}
          name={input.name || "input"}
          placeholder={input.placeholder}
          className={clsx("block min-w-0 grow py-1.5 pr-3 pl-3 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6", `${input.classes}`)}
          value={input.value}
          onChange={input.onChange}
        />
      </div>
      {input.error && <p className="text-xs text-red-500 mt-1">{input.error}</p>}
    </>
  );
}
