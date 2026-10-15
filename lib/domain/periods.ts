// Pure date ranges for history queries (no Firebase). Weeks start on Monday, local time.

export type HistoryPeriod = "week" | "prev-week" | "current-week" | "month" | "year";

function startOfDay(date: Date, offsetDays = 0): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offsetDays);
}

export function getHistoryRange(period: HistoryPeriod, now: Date = new Date()): { from: Date; to: Date } {
  switch (period) {
    case "week":
      return { from: startOfDay(now, -7), to: now };
    case "prev-week":
      return { from: startOfDay(now, -14), to: startOfDay(now, -7) };
    case "current-week": {
      const jsDay = now.getDay(); // 0 = Sunday
      const offsetFromMonday = jsDay === 0 ? 6 : jsDay - 1;
      return { from: startOfDay(now, -offsetFromMonday), to: now };
    }
    case "month":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    case "year":
      return { from: new Date(now.getFullYear(), 0, 1), to: now };
  }
}
