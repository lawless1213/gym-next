"use client";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./Button";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  tabsClasses?: string;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: any) => void;
  children: React.ReactNode;
  tabsClasses?: string;
}

export function Tabs({ items, activeTab, onChange, children, tabsClasses }: TabsProps) {
  const layoutId = React.useId();

  return (
    <>
      <div className={cn(
        "flex gap-2 md:gap-4 rounded-xl bg-secondary p-1 relative", tabsClasses
      )} >
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Button
              variant="link"
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "relative z-10 flex-1 hover:no-underline",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-card rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              {item.icon && <span className="z-20">{item.icon}</span>}
              <span className="z-20">{item.label}</span>
            </Button>
          );
        })}
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="h-full flex flex-col gap-3"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}