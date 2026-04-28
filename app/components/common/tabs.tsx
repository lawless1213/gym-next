"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import React from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: any) => void;
  children: React.ReactNode;
}

export function Tabs({ items, activeTab, onChange, children }: TabsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 rounded-xl bg-secondary p-1 relative">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "relative z-10 cursor-pointer flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors outline-none",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-card rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              {item.icon && <span className="z-20">{item.icon}</span>}
              <span className="z-20">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}