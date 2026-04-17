'use client';

import { usePathname } from "next/navigation";
import { navLinks } from "@/app/data/navManu";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useUser } from "@/app/hooks/useUser";


export function BottomNav() {
  const t = useTranslations("components.bottomNav");
  const { user } = useUser();

  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        {navLinks
        .filter((navItem) => {
          return !navItem.loginRequired || user;
        })
          .map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.label}
              href={item.link}
              className={`flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={item.label}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <item.icon 
                  className={`h-6 w-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} 
                />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[10px] font-medium capitalize ${isActive ? 'font-semibold' : ''}`}>
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}

