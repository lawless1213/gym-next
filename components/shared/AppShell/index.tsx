"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { BottomNav } from "@/components/shared/BottomNav";
import { getNavLinks, navLinks } from "@/data/navManu";
import { Toaster } from "@/components/shared/Toaster/Toaster";
import { Header } from "../Header";
import { NavItem } from "@/types/navMenu";
import InstallBanner from "../InstallBanner";
import { useUserPreferences } from "@/providers/user-preferences-provider";

let prevPathname = "";
let currentDir = 1;

function getDirection(from: string, to: string, routes: string[]) {
  const fi = routes.indexOf(from);
  const ti = routes.indexOf(to);
  if (fi === -1 || ti === -1) return 1;
  return ti > fi ? 1 : -1;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();
  const { isLoading: paramsLoading } = useUserPreferences();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const pageKey = pathname.split("/")[1] || "home";

  const routes = useMemo(
    () =>
      getNavLinks(!!user)
        .map((n: NavItem) => n.link)
        .filter((l): l is string => !!l),
    [user],
  );

  const isProtectedRoute = navLinks.some((item: NavItem) => item.link === pathname && item.loginRequired);

  useEffect(() => {
    if (!loading && !user && isProtectedRoute) {
      router.replace("/");
    }
  }, [loading, user, isProtectedRoute, router]);

  if (prevPathname !== pathname) {
    currentDir = prevPathname ? getDirection(prevPathname, pathname, routes) : 1;
    prevPathname = pathname;
  }

  function navigate(dir: 1 | -1) {
    const idx = routes.indexOf(pathname);
    const next = routes[idx + dir];
    if (next) router.push(next);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate(1),
    onSwipedRight: () => navigate(-1),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <AnimatePresence mode="sync">
      {loading || (user && paramsLoading) ? (
        <LoadingScreen key="loading" />
      ) : (
        <div
          key="app"
          className="mx-auto flex min-h-screen w-full max-w-[1920px] flex-col">
          <InstallBanner />
          <Header page={pageKey} />
          <Toaster />
          <BottomNav />
          <main
            {...handlers}
            style={{ touchAction: "pan-y" }}
            className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pt-4 pb-18">
            <motion.div
              key={pathname}
              initial={{ x: `${30 * currentDir}%`, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: `${-30 * currentDir}%`, opacity: 0 }}
              transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}>
              {children}
            </motion.div>
          </main>
        </div>
      )}
    </AnimatePresence>
  );
}
