"use client";

import { IconUser, IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/app/hooks/useAuth";
import RoutineCard from "../../components/cards/routine";
import { useRoutines } from "@/app/hooks/useServices/useRoutines";
import SkeletonBone from "@/app/components/common/skeletonBone";
import SkeletonSwitcher from "@/app/components/common/SkeletonSwitcher";
import { useModal } from "@/app/lib/modal/modal-store";
import { useTranslations } from "next-intl";
import ActionCard from "@/app/components/cards/action";

const RoutinesSkeleton = (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonBone
        key={i}
        br={12}
        height={104}
      />
    ))}
  </div>
);

export default function Routines() {
  const t = useTranslations("Library.routines");
  const { open } = useModal();
  const { user } = useAuth();
  const userID = user?.uid;

  const { data: routines = [], isLoading: loading } = useRoutines(userID);

  return (
    <>
      <SkeletonSwitcher
        isLoading={loading}
        skeleton={RoutinesSkeleton}>
        <div className="space-y-3">
          {
            user ? (
              routines.length === 0 ? (
                <ActionCard
                  title={t('empty')}
                  icon={IconPlus}
                  onClick={() => open('routine')}
                />
              ) : (
                routines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    {...routine}
                  />
                ))
              )
            ) : (
              <ActionCard
                title={t('not-auth')}
                icon={IconUser}
                onClick={() => open('auth')}
              />
            )
          }
        </div>
      </SkeletonSwitcher>
    </>
  );
}
