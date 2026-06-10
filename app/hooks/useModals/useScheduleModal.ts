import { useModal } from "@/app/lib/modal/modal-store";
import { Routine } from "@/app/types";

type ScheduleModalData = {
  dayIndex: number;
  routines: Routine[];
};

export function useScheduleModal() {
  const modal = useModal();
  const data = modal.data as ScheduleModalData;
	
  return {
    ...modal,
    dayIndex: data?.dayIndex,
    routineList: data?.routines,
  };
}