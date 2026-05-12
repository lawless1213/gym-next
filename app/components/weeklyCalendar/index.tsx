"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useState } from "react";
import { ScheduleMap, weekDays } from "@/app/types";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import RoutineCard from "../cards/routine";
import { useSchedule } from "@/app/hooks/useServices/useSchedule";
import SkeletonBone from "../common/skeletonBone";
import SkeletonSwitcher from "../common/SkeletonSwitcher"; 

export function WeeklyCalendar() {
  const t = useTranslations("HomePage.weeklyCalendar");
  const { user, loading: isUserLoading } = useAuth();
  const userID = user?.uid;
  const [openCardIndex, setopenCardIndex] = useState<null | number>(null);

  const d = new Date();
  const today = d.getDay();
  const todayDate = d.getDate();
  const todayIndex = today === 0 ? 6 : today - 1;

  const createEmptySchedule = (): ScheduleMap =>
    weekDays.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as ScheduleMap);

  const emptySchedule = createEmptySchedule();
  const { data, isLoading: isDataLoading } = useSchedule(userID);
  const scheduleDays: ScheduleMap = userID ? (data ?? emptySchedule) : emptySchedule;

  const isLoading = isUserLoading || isDataLoading || (!!userID && !data);

  const cardToggler = (index: number) => {
    setopenCardIndex((prev) => (prev === index ? null : index));
  };

  const CalendarSkeleton = (
    <div className="flex items-center justify-between gap-1 w-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonBone key={i} br={10} height={74} />
      ))}
    </div>
  );

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{t("title")}</h3>

      <SkeletonSwitcher
        isLoading={isLoading}
        skeleton={CalendarSkeleton}
      >
        <div className="flex items-center justify-between gap-1 mb-[-1px]">
          {weekDays.map((day, index) => {
            const isToday = index === todayIndex;
            const workout = scheduleDays[day];
            const hasWorkout = workout.length > 0;
            const isPast = index < todayIndex;
            const isOpen = openCardIndex === index && scheduleDays[weekDays[openCardIndex]].length > 0;

            return (
              <button
                key={day}
                onClick={() => cardToggler(index)}
                className={`flex flex-1 flex-col items-center gap-1.5 py-2 rounded-md transition-all min-h-[72px] overflow-hidden cursor-pointer hover:bg-secondary/80 ${
                  isToday ? "border-primary border-t" : ""} ${isOpen ? "bg-secondary/80 rounded-b-none" : ""}`}
              >
                <span className="text-[12px] font-medium uppercase text-muted-foreground">{t(`${day}`)}</span>
                <span className="text-sm font-bold">{todayDate - todayIndex + index}</span>
                {hasWorkout && <div className={`h-1.5 w-1.5 rounded-full ${isPast ? "bg-muted-foreground" : "bg-primary"}`} />}
              </button>
            );
          })}
        </div>
      </SkeletonSwitcher>

      <AnimatePresence initial={false} mode="wait">
        {openCardIndex !== null && scheduleDays[weekDays[openCardIndex]].length > 0 && (
          <motion.div
            key={weekDays[openCardIndex]}
            className="overflow-hidden"
            initial={{ opacity: 1, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 1, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="overflow-hidden flex flex-col gap-2 p-4 bg-secondary/80 rounded-xl">
              {scheduleDays[weekDays[openCardIndex]].map((routine) => (
                <RoutineCard key={routine.id} {...routine} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}