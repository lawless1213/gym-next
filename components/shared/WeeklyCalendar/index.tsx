"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useRef, useState } from "react";
import { ScheduleMap, weekDays } from "@/types";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import RoutineCard from "../cards/RoutineCard";
import { useSchedule } from "@/app/hooks/useServices/useSchedule";
import SkeletonBone from "../../ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "../../ui/Skeleton/SkeletonSwitcher";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useModal } from "@/lib/modal/modal-store";
import { Button } from "../../ui/Button";

type WeeklyCalendarProps = {
  schedule?: ScheduleMap;
};

const TAB_HIGHLIGHT_DELAY = 0;

export function WeeklyCalendar({ schedule }: WeeklyCalendarProps = {}) {
  const t = useTranslations("components.weeklyCalendar");
  const tDays = useTranslations("components.day.short");
  const isPreview = schedule != null;
  const { user, loading: isUserLoading } = useAuth();
  const userId = isPreview ? undefined : user?.uid;
  const { open } = useModal();

  const [openCardIndex, setOpenCardIndex] = useState<null | number>(null);
  const [highlightIndex, setHighlightIndex] = useState<null | number>(null);
  const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);
  const pendingIndexRef = useRef<null | number>(null);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const d = new Date();
  const today = d.getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  const monday = new Date(d);
  monday.setDate(d.getDate() - todayIndex);

  const weekDates = weekDays.map((_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.getDate();
  });

  const createEmptySchedule = (): ScheduleMap =>
    weekDays.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as ScheduleMap);

  const emptySchedule = createEmptySchedule();
  const { data, isLoading: isDataLoading } = useSchedule(userId);
  const scheduleDays: ScheduleMap = isPreview
    ? schedule
    : userId
      ? (data ?? emptySchedule)
      : emptySchedule;
  const isLoading = isPreview
    ? false
    : isUserLoading || isDataLoading || (!!userId && !data);

  const startOpening = (index: number) => {
    setHighlightIndex(index);
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => {
      setOpenCardIndex(index);
    }, TAB_HIGHLIGHT_DELAY);
  };

  const cardToggler = (index: number) => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);

    if (openCardIndex === index) {
      pendingIndexRef.current = null;
      setOpenCardIndex(null);
      return;
    }

    if (openCardIndex !== null) {
      pendingIndexRef.current = index;
      setOpenCardIndex(null);
      return;
    }

    startOpening(index);
  };

  const handleExitComplete = () => {
    if (pendingIndexRef.current !== null) {
      const next = pendingIndexRef.current;
      pendingIndexRef.current = null;
      startOpening(next);
    } else {
      setHighlightIndex(null);
    }
  };

  const editScheduleHandler = (openCardIndex:number) => {
    if (user) {
      open("schedule", { dayIndex: openCardIndex, routines: scheduleDays[weekDays[openCardIndex]] });
    } else {
      open("auth");
    }
  };

  const CalendarSkeleton = (
    <div className="flex items-center justify-between gap-1 w-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonBone
          key={i}
          br={10}
          height={74}
        />
      ))}
    </div>
  );

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{t("title")}</h3>

      <SkeletonSwitcher
        isLoading={isLoading}
        skeleton={CalendarSkeleton}>
        <div className="flex items-center justify-between gap-1 -mb-px">
          {weekDays.map((day, index) => {
            const isToday = index === todayIndex;
            const workout = scheduleDays[day];
            const hasWorkout = workout.length > 0;
            const canOpen = !isPreview || hasWorkout;
            const isPast = index < todayIndex;
            const isActive = highlightIndex === index || hoveredIndex === index;

            return (
              <div
                key={day}
                onClick={() => canOpen && cardToggler(index)}
                onMouseEnter={() => canOpen && setHoveredIndex(index)}
                onMouseLeave={() =>
                  setHoveredIndex((prev) => (prev === index ? null : prev))
                }
                className={`relative flex flex-1 flex-col items-center gap-1.5 py-2 rounded-t-md min-h-[72px] overflow-hidden ${isToday ? "border-primary border-t" : ""} ${canOpen ? "cursor-pointer" : "cursor-default"}`}>
                <span
                  aria-hidden
                  className={`absolute inset-0 bg-secondary/80 transition-[clip-path] duration-250 ease-in-out pointer-events-none`}
                  style={{
                    clipPath: isActive ? "inset(0% 0 0% 0)" : "inset(0% 0 100% 0)",
                  }}
                />
                <span className="relative z-10 text-[12px] font-medium uppercase text-muted-foreground">
                  {tDays(`${day}`)}
                </span>
                <span className="relative z-10 text-sm font-bold">{weekDates[index]}</span>
                {hasWorkout && (
                  <div
                    className={`relative z-10 h-1.5 w-1.5 rounded-full ${isPast ? "bg-muted-foreground" : "bg-primary"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </SkeletonSwitcher>

      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={handleExitComplete}>
        {openCardIndex !== null && (
          <motion.div
            key={weekDays[openCardIndex]}
            className="overflow-hidden"
            initial={{ opacity: 1, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 1, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            <div
              className={`overflow-hidden flex flex-col gap-3 py-3 bg-secondary/80 rounded-b-md md:p-3
                ${openCardIndex === 0 ? "rounded-tl-none" : ""}
                ${openCardIndex === weekDays.length - 1 ? "rounded-tr-none" : ""}`}>
              {scheduleDays[weekDays[openCardIndex]].map((routine) => (
                <RoutineCard
                  key={routine.id}
                  {...routine}
                  available={!isPreview && openCardIndex === todayIndex}
                  editable={false}
                />
              ))}
              {!isPreview && (
                <Button
                  size="lg"
                  variant="dashed"
                  onClick={() => editScheduleHandler(openCardIndex)}>
                  {scheduleDays[weekDays[openCardIndex]].length > 0 ? (
                    <>
                      <IconEdit className="size-5" />
                      <span>{t("edit")}</span>
                    </>
                  ) : (
                    <>
                      <IconPlus className="size-5" />
                      <span>{t("edit")}</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}