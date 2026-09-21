"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner"; // Або ваш кастомний toast
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/components/modals/modal-store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { getNavLinks } from "@/data/navManu";
import { NavItem } from "@/types/navMenu";
import { IconCarambolaFilled } from "@tabler/icons-react";

export function BottomNav() {
  const t = useTranslations("components.bottomNav");
  const tNotification = useTranslations("notification");
  const { user } = useAuth();
  const { open } = useModal();
  const pathname = usePathname();

  const isVerified = Boolean(user?.emailVerified);

  const handleAction = (e: React.MouseEvent, item: NavItem) => {
    if (item.verifyRequired && !isVerified) {
      e.preventDefault();
      toast.warning(tNotification("verifyRequiredWarning"));
      return;
    }

    if (item.modal) {
      open(item.modal);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {getNavLinks(!!user).map((item: NavItem) => {
          const isActive = Boolean(item.link && pathname === item.link);
          const baseStyles = `flex-1 flex h-16 justify-center flex-col items-center gap-1 rounded-xl py-2 transition-all duration-200 ${isActive ? "text-primary pointer-events-none" : "text-muted-foreground hover:text-foreground cursor-pointer"}`;

          const content = (
            <div className={`relative min-h-10 flex items-center transition-transform ${isActive ? "scale-125" : ""}`}>
              {item.icon}
              {
                item.subscribeRequired &&
                <div className="absolute top-0 left-[60%] bg-card/95 p-1 rounded-[100%]">
                  <IconCarambolaFilled className="size-2 text-foreground " />
                </div>
              }
            </div>
          );

          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                {item.link ? (
                  <Link
                    href={item.link}
                    onClick={(e) => handleAction(e, item)}
                    className={baseStyles}
                    aria-label={t(item.label)}>
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleAction(e, item)}
                    className={baseStyles}
                    aria-label={t(item.label)}>
                    {content}
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent side="top">{t(item.label)}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}
