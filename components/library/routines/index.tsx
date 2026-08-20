"use client";

import { IconUser, IconPlus } from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";
import RoutineCard from "../../shared/cards/RoutineCard";
import { useRoutines } from "@/hooks/useServices/useRoutines";
import SkeletonBone from "@/components/ui/Skeleton/SkeletonBone";
import SkeletonSwitcher from "@/components/ui/Skeleton/SkeletonSwitcher";
import { useModal } from  "@/components/modals/modal-store";
import { useTranslations } from "next-intl";
import ActionCard from "@/components/shared/cards/ActionCard";
import RoutinesList from "./RoutinesList";
import ButtonAdd from "@/components/shared/ButtonAdd";

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
  const userId = user?.uid;

  const { data: routines = [], isLoading: loading } = useRoutines(userId);

  return (
    <>
      <SkeletonSwitcher
        isLoading={loading}
        skeleton={RoutinesSkeleton}>
        {user ? (
          <RoutinesList routines={routines} />
        ) : (
          <ActionCard
            title={t("not-auth")}
            icon={IconUser}
            onClick={() => open("auth")}
          />
        )}
      </SkeletonSwitcher>
      {user && <ButtonAdd onClick={() => open('routine')}  ariaLabel={t("buttonAdd")}/>}
    </>
  );
}
