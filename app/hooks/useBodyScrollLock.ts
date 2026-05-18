import { useEffect } from "react";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (!locked) {
      root.style.removeProperty("overflow");
      body.style.removeProperty("overflow");
      body.style.removeProperty("padding-right");
      return;
    }

    const prevRoot = root.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gutter = window.innerWidth - root.clientWidth;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    return () => {
      root.style.overflow = prevRoot;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, [locked]);
}
