"use client";

type LabelType = {
  text: string;
  icon?: React.ReactNode;
  for: string;
};

type LabelProps = {
  label: LabelType;
};

export const Label = ({ label }: LabelProps) => {
  return (
    <label htmlFor={label.for} className="text-sm font-medium text-muted-foreground mb-2 block items-center gap-1.5">
      {label.icon && <span>{label.icon}</span>}
      <span>{label.text}</span>
    </label>
  );
};

Label.displayName = "Label";