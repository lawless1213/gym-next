"use client";

import { IconUser, IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/app/hooks/useAuth";
import RoutineCard from "../../__components/cards/routine";
import { useRoutines } from "@/app/hooks/useServices/useRoutines";
import SkeletonBone from "@/app/__components/common/skeletonBone";
import SkeletonSwitcher from "@/app/__components/common/SkeletonSwitcher";
import { useModal } from "@/app/lib/modal/modal-store";
import { useTranslations } from "next-intl";
import ActionCard from "@/app/__components/cards/action";

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
        {user ? (
          routines.length === 0 ? (
            <ActionCard
              title={t("empty")}
              icon={IconPlus}
              onClick={() => open("routine")}
            />
          ) : (
            <div className="space-y-3 max-md:-mx-4">
              {routines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  editable={true}
                  {...routine}
                />
              ))}
            </div>
          )
        ) : (
          <ActionCard
            title={t("not-auth")}
            icon={IconUser}
            onClick={() => open("auth")}
          />
        )}
      </SkeletonSwitcher>
    </>
  );
}
