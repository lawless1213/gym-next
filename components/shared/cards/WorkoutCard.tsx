"use client";

import { Routine } from "@/types";
import { IconPlayerPlayFilled, IconBarbell, IconRotateClockwise } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { useLocale, useTranslations } from "next-intl";
import { useModal } from "@/components/modals/ModalProvider";
import { getLocalizedText, type Locale } from "@/types/common";
import { useAuth } from "@/hooks/useAuth";
import { useStoredDraft } from "@/hooks/workout/useStoredDraft";

interface WorkoutCardProps {
  routine: Routine;
}

export function WorkoutCard({ routine }: WorkoutCardProps) {
  const t = useTranslations("home.workoutCard");
  const locale = useLocale() as Locale;
  const { open, confirm } = useModal();
  const { user } = useAuth();
  // An unfinished workout of this routine saved on this device (see lib/workoutStorage.ts).
  const draft = useStoredDraft(user?.uid, routine.id);

  const handleRestart = async () => {
    const ok = await confirm({ title: t("restartConfirm") });
    if (!ok) return;
    draft.discard();
    open("workout", routine);
  };

  return (
    <div
      className="overflow-hidden rounded-2xl bg-card"
      style={{ borderLeft: `4px solid ${routine.color}` }}>
      <div
        className="relative p-4"
        style={{
          background: `linear-gradient(135deg, ${routine.color}30, ${routine.color}10)`,
        }}>
        <div className="flex h-full flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground">{t("title")}</span>
            <h3 className="text-xl font-bold text-foreground">{routine.name}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconBarbell className="h-3.5 w-3.5" />
              {t("exercisesValue")}: {routine.exercises.length}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {routine.exercises.slice(0, 3).map((ex) => (
              <span
                key={ex.id}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs text-foreground">
                {getLocalizedText(ex.name, locale)}
              </span>
            ))}
            {routine.exercises.length > 3 && (
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                +{routine.exercises.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
      {routine.available && (
        <div className="p-4 pt-3">
          {draft.hasDraft ? (
            <>
              <p className="mb-2 text-xs text-muted-foreground">{t("draftProgress", { count: draft.completedSets })}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => open("workout", routine)}
                  className="w-full cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg">
                  <IconPlayerPlayFilled className="h-5 w-5 fill-current" />
                  {t("continueButton")}
                </Button>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="w-full cursor-pointer gap-2"
                  size="lg">
                  <IconRotateClockwise className="h-5 w-5" />
                  {t("restartButton")}
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={() => open("workout", routine)}
              className="w-full cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg">
              <IconPlayerPlayFilled className="h-5 w-5 fill-current" />
              {t("startButton")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
