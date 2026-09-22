import type { TablerIcon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  icon?: TablerIcon;
  onClick?: () => void;
  classNames?: string;
}

export default function ActionCard({ title, icon: Icon, classNames, onClick }: ActionCardProps) {
  const interactive = Boolean(onClick);

  return (
    <div
      className={`rounded-xl p-4 flex gap-2 bg-card items-center justify-between ${classNames}`}>
      <div>
        <h3 className="font-semibold text-foreground transition-[0.2s]">
          {title}
        </h3>
      </div>
      {Icon && (
        <div
					onClick={onClick}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary border-2 border-transparent border-solid transition-[0.2s]",
            interactive && "group hover:border-primary cursor-pointer",
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
