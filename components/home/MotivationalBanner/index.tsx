"use client";

import { useFormatter, useLocale, useTranslations } from "next-intl";
import {
  IconRocket,
  IconSeedlingFilled,
  IconStretching,
  IconTargetArrow,
  IconTrendingUp,
  IconTrophy,
  IconTrophyFilled,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { useStartQuickWorkout } from "@/hooks/useStartQuickWorkout";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";
import { dailyVariant, getBannerState, type BannerState } from "@/lib/domain/banner";
import { cn } from "@/lib/utils";
import { GrowingBar, RecordConfetti, Shine, Watermark, useCountUp } from "./_components/Effects";
import { getLocalizedText, type Locale } from "@/types/common";
import { PersonalRecord, WorkoutSession } from "@/types";

/** Copy variants per state in messages (components.motivationalBanner.motivation.<kind>.<n>). */
const MOTIVATION_VARIANTS = 3;

type MotivationalBannerProps = {
  records: PersonalRecord[];
  lastWeekHistory: WorkoutSession[];
  prevWeekHistory: WorkoutSession[];
  isLoading?: boolean;
};

export function MotivationalBanner({ records, lastWeekHistory, prevWeekHistory, isLoading }: MotivationalBannerProps) {
  const state = getBannerState({ thisWeek: lastWeekHistory, prevWeek: prevWeekHistory, records });

  return (
    <SkeletonSwitcher
      isLoading={!!isLoading}
      skeleton={
        <SkeletonBone
          br={20}
          height={196}
        />
      }>
      <BannerCard state={state} />
    </SkeletonSwitcher>
  );
}

function BannerCard({ state }: { state: BannerState<PersonalRecord> }) {
  const t = useTranslations("components.motivationalBanner");
  const tMeasurement = useTranslations("components.measurement");
  const format = useFormatter();
  const locale = useLocale() as Locale;
  const { params } = useUserPreferences();
  const startQuickWorkout = useStartQuickWorkout();

  const unit = tMeasurement(params.weight);
  const weight = (value: number) => `${format.number(value, { maximumFractionDigits: 1 })} ${unit}`;
  const motivation = t(`motivation.${state.kind}.${dailyVariant(MOTIVATION_VARIANTS)}`);
  const stats = t("stats", { workouts: state.workouts, records: state.records });

  // The hero number of each state, counted up on appear.
  const heroTarget =
    state.kind === "record" ? state.record.weight : state.kind === "up" ? state.percent : state.thisVolume;
  const hero = useCountUp(heroTarget);

  const startButton = (variant: "default" | "outline") => (
    <Button
      variant={variant}
      size="lg"
      className={cn("mt-2 h-11 w-full rounded-xl text-[15px] font-bold", variant === "outline" && "text-foreground")}
      onClick={() => startQuickWorkout()}>
      {t("start")}
    </Button>
  );

  if (state.kind === "record") {
    const { record } = state;
    return (
      <Shell
        className="bg-volt text-volt-foreground"
        watermark={
          <Watermark
            icon={IconTrophyFilled}
            className="text-volt-foreground/10"
          />
        }
        effects={
          <>
            <Shine />
            <RecordConfetti
              recordKey={`${record.exerciseId}:${record.weight}:${record.reps}`}
              colors={["#0D0E0B", "#FFFFFF", "#576E00"]}
            />
          </>
        }>
        <Label icon={<IconTrophy className="size-[18px]" />}>{t("recordLabel")}</Label>
        <Hero>{weight(hero)}</Hero>
        <p className="text-[15px] font-semibold">
          {getLocalizedText(record.exerciseName, locale)}
          {" · "}
          {state.gain != null ? t("recordGain", { value: weight(state.gain) }) : t("recordFirst")}
        </p>
        <p className="text-sm">{motivation}</p>
        {state.otherRecords > 0 && (
          <span className="mt-2 self-start rounded-full bg-volt-foreground/10 px-2.5 py-1.5 text-[13px] font-semibold">
            {t("otherRecords", { count: state.otherRecords })}
          </span>
        )}
      </Shell>
    );
  }

  const cardClass = "border border-border bg-card";
  const watermarkClass = "text-foreground/[0.06]";

  if (state.kind === "empty") {
    return (
      <Shell
        className={cardClass}
        watermark={
          <Watermark
            icon={IconStretching}
            className={watermarkClass}
          />
        }>
        <Label className="text-muted-foreground">{t("volumeLabel")}</Label>
        <h3 className="font-display text-xl leading-snug font-bold">{motivation}</h3>
        {state.prevWorkouts > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("lastWeek", { workouts: state.prevWorkouts, volume: weight(state.prevVolume) })}
          </p>
        )}
        {startButton("default")}
      </Shell>
    );
  }

  const max = Math.max(state.thisVolume, state.prevVolume, 1);
  // Illustration per state: momentum, aim, a habit sprouting.
  const icon = state.kind === "up" ? IconRocket : state.kind === "down" ? IconTargetArrow : IconSeedlingFilled;

  return (
    <Shell
      className={cardClass}
      watermark={
        <Watermark
          icon={icon}
          className={state.kind === "up" ? "text-primary/10" : watermarkClass}
        />
      }>
      <Label
        icon={state.kind === "up" ? <IconTrendingUp className="size-[18px]" /> : undefined}
        className={state.kind === "up" ? "text-primary" : "text-muted-foreground"}>
        {t("volumeLabel")}
      </Label>

      {state.kind === "up" ? (
        <Hero className="text-primary">+{format.number(hero)}%</Hero>
      ) : (
        <Hero>{weight(hero)}</Hero>
      )}

      <p className="text-[15px] font-semibold text-foreground">{motivation}</p>
      <p className="text-sm text-muted-foreground">
        {state.kind === "down" ? t("catchUp", { count: state.workoutsToCatchUp }) : stats}
      </p>

      {state.kind !== "first" && (
        <div className="mt-2.5 flex flex-col gap-2">
          <VolumeBar
            label={t("thisWeek")}
            value={weight(state.thisVolume)}
            ratio={state.thisVolume / max}
            current
          />
          <VolumeBar
            label={t("prevWeek")}
            value={weight(state.prevVolume)}
            ratio={state.prevVolume / max}
          />
        </div>
      )}

      {state.kind === "down" && startButton("outline")}
    </Shell>
  );
}

/** Card frame: clips the watermark and effects, keeps content above them. */
function Shell({
  className,
  watermark,
  effects,
  children,
}: {
  className: string;
  watermark: React.ReactNode;
  effects?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("relative overflow-hidden rounded-[20px] p-5", className)}>
      {watermark}
      {effects}
      <div className="relative flex flex-col gap-1.5">{children}</div>
    </section>
  );
}

function Label({
  icon,
  className,
  children,
}: {
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-[13px] font-bold", className)}>
      {icon}
      {children}
    </div>
  );
}

function Hero({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("font-display text-[40px] leading-tight font-bold tracking-tight tabular-nums", className)}>
      {children}
    </p>
  );
}

function VolumeBar({
  label,
  value,
  ratio,
  current,
}: {
  label: string;
  value: string;
  ratio: number;
  current?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <span className="w-[70px] shrink-0 text-muted-foreground">{label}</span>
      <div className="h-2 grow overflow-hidden rounded-full bg-secondary">
        <GrowingBar
          ratio={ratio}
          delay={current ? 0.1 : 0.2}
          className={cn("h-full rounded-full", current ? "bg-primary" : "bg-muted-foreground/40")}
        />
      </div>
      <span className={cn("w-20 shrink-0 text-right", current ? "font-bold" : "text-muted-foreground")}>{value}</span>
    </div>
  );
}
