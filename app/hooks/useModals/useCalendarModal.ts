import { useModal } from "@/app/lib/modal/modal-store";
import { Routine } from "@/app/types";

type CalendarModalData = {
  dayIndex: number;
  routines: Routine[];
};

export function useCalendarModal() {
  const modal = useModal();
  const data = modal.data as CalendarModalData;
	
  return {
    ...modal,
    dayIndex: data?.dayIndex,
    routineList: data?.routines,
  };
}