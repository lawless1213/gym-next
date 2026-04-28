"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { navLinks } from "./data/navManu";

const routes = navLinks.map((n) => n.link);

let prevPathname = "";
let currentDir = 1;

function getDirection(from: string, to: string) {
  const fi = routes.indexOf(from);
  const ti = routes.indexOf(to);
  if (fi === -1 || ti === -1) return 1;
  return ti > fi ? 1 : -1;
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (prevPathname !== pathname) {
    currentDir = prevPathname ? getDirection(prevPathname, pathname) : 1;
    prevPathname = pathname;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ x: `${30 * currentDir}%`, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: `${-30 * currentDir}%`, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      {children}
    </motion.div>
  );
}
