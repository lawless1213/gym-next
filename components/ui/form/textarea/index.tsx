"use client";
import clsx from "clsx";
import { forwardRef } from "react";
import { Label } from "../label";

type TextAreaType = {
  placeholder?: string;
  icon?: React.ReactNode;
  classes?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  type?: string;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
	rows?: number;
};

type TextAreaProps = {
  textarea: TextAreaType;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ textarea }, _ref) => {
    return (
      <>
        <div>
          {textarea.label && (<Label label={{ text: textarea.label, for: textarea.id || "textarea" }} />)}
          <textarea
            ref={_ref}
            id={textarea.id || "textarea"}
            name={textarea.name}
            value={textarea.value}
            onChange={textarea.onChange}
						rows={textarea.rows || 3}
            onBlur={textarea.onBlur}
            placeholder={textarea.placeholder}
            className={clsx(
              "w-full rounded-xl resize-none bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
              textarea.error && "ring-2 ring-red-500",
              textarea.classes
            )}
          />
          <p className="text-xs text-red-500 min-h-[20px]">{textarea.error}</p>
        </div>
      </>
    );
  }
);

TextArea.displayName = "TextArea";