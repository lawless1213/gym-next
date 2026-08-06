import { Button } from "../../common/buttons/button";
import { Label } from "../label";

export function ChipGroup<T extends string>({
  items,
  value,
  label,
  onChange,
  error,
  id,
  formatLabel,
}: {
  items: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  error?: string;
  label?: string;
  id?: string;
  formatLabel?: (item: T) => string;
}) {
  return (
    <div className="space-y-1.5">
      {label && ( <Label label={{ text: label, for: id || "select" }} /> )}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const checked = value.includes(item);
          return (
            <Button
              variant={checked ? "default" : "secondary"}
              key={item}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() =>
                onChange(checked ? value.filter((v) => v !== item) : [...value, item])
              }
            >
              {formatLabel ? formatLabel(item) : item}
            </Button>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}