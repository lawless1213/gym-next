"use client";

import { usePathname } from "next/navigation";
import { getNavLinks } from "@/data/navManu";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/app/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

export function BottomNav() {
  const t = useTranslations("components.bottomNav");
  const { user } = useAuth();

  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex h-12 max-w-lg items-center justify-around px-4">
        {getNavLinks(!!user).map((item) => {
          const isActive = pathname === item.link;
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  href={item.link}
                  className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200 ${isActive ? "text-primary pointer-events-none cursor-none" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label={item.label}>
                  <div className={`relative ${isActive ? "scale-130" : ""} transition-transform`}>
                    <item.icon className={`h-6 w-6`} />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">{t(item.label)}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}
