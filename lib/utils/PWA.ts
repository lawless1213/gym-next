export const DISMISS_KEY = "pwa-install-dismissed-until";
export const DISMISS_DAYS = 7;
 
export function isIos(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}
 
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error — старе iOS Safari API
    window.navigator.standalone === true
  );
}
 
export function isDismissed(): boolean {
  const dismissedUntil = localStorage.getItem(DISMISS_KEY);
  return Boolean(dismissedUntil && Date.now() < Number(dismissedUntil));
}
 
export function dismissForDays(days: number = DISMISS_DAYS): void {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(DISMISS_KEY, String(until));
}
 