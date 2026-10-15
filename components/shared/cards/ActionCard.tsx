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
    <div className={`flex items-center justify-between gap-2 rounded-xl bg-card p-4 ${classNames}`}>
      <div>
        <h3 className="font-semibold text-foreground transition-[0.2s]">{title}</h3>
      </div>
      {Icon && (
        <div
          onClick={onClick}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-solid border-transparent bg-secondary transition-[0.2s]",
            interactive && "group cursor-pointer hover:border-primary",
          )}>
          <Icon
            className={cn("h-5 w-5 text-muted-foreground transition-[0.2s]", interactive && "group-hover:text-primary")}
          />
        </div>
      )}
    </div>
  );
}
