"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { useAuth } from "@/app/hooks/useAuth";
import LoadingScreen from "../LoadingScreen";
import { BottomNav } from "../bottomNav";
import { getNavLinks, navLinks } from "@/app/data/navManu";
import { Toaster } from "../toaster/Toaster";


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
  const pathname = usePathname();
  const router = useRouter();

  const routes = useMemo(
    () => getNavLinks(!!user).map((n) => n.link),
    [user],
  );

  const isProtectedRoute = navLinks.some(
    (item) => item.link === pathname && item.loginRequired,
  );

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
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" />
      ) : (
        <div
          key="app"
          className="flex min-h-screen flex-col">
          <Toaster/>
          <BottomNav />
          <main
            {...handlers}
            style={{ touchAction: "pan-y" }}
            className="min-h-0 flex-1 overflow-y-auto p-4 pb-24">
            <motion.div
              key={pathname}
              initial={{ x: `${30 * currentDir}%`, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: `${-30 * currentDir}%`, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}>
              {children}
            </motion.div>
          </main>
        </div>
      )}
    </AnimatePresence>
  );
}
