'use client';

import { IconFlame, IconTrendingUp } from '@tabler/icons-react';

export function MotivationalBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-5">
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <IconFlame className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-primary">12 Day Streak</span>
        </div>
        <h3 className="mb-1 text-lg font-bold text-foreground">
          Keep pushing your limits!
        </h3>
        <p className="text-sm text-muted-foreground">
          You&apos;re on track for your best month yet. 3 PRs this week!
        </p>
        <div className="mt-3 flex items-center gap-2">
          <IconTrendingUp className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">+15% volume vs last week</span>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
    </div>
  );
}