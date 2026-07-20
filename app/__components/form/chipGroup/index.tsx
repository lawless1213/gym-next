import { Label } from "../label";

export function ChipGroup<T extends string>({
  items,
  value,
  label,
  onChange,
  error,
  id,
}: {
  items: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  error?: string;
  label?: string;
  id?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label && ( <Label label={{ text: label, for: id || "select" }} /> )}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const checked = value.includes(item);
          return (
            <button
              key={item}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() =>
                onChange(checked ? value.filter((v) => v !== item) : [...value, item])
              }
              className={`cursor-pointer flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                checked ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              {item}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}