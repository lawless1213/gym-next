import type { TablerIcon } from "@tabler/icons-react";
import { cn } from "@/app/lib/utils";

interface ActionCardProps {
  title: string;
  icon?: TablerIcon;
  onClick?: () => void;
}

export default function ActionCard({ title, icon: Icon, onClick }: ActionCardProps) {
  const interactive = Boolean(onClick);

  return (
    <div
      className={cn(
        "rounded-xl bg-card p-4 flex gap-2 items-center justify-between",
        interactive && "group cursor-pointer",
      )}
      onClick={onClick}>
      <div>
        <h3
          className={cn(
            "font-semibold text-foreground transition-[0.2s]",
            interactive && "group-hover:text-primary",
          )}>
          {title}
        </h3>
      </div>
      {Icon && (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary border-2 border-transparent border-solid transition-[0.2s]",
            interactive && "group-hover:border-primary",
          )}>
          <Icon
            className={cn(
              "h-5 w-5 text-muted-foreground transition-[0.2s]",
              interactive && "group-hover:text-primary",
            )}
          />
        </div>
      )}
    </div>
  );
}
