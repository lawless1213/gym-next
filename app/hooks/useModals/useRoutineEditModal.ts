import { useModal } from "@/app/lib/modal/modal-store";
import { Routine } from "@/app/types";

type RoutineEditModalData = {
  routine: Routine;
};

export function useRoutineEditModal() {
  const modal = useModal();
  const data = modal.data as RoutineEditModalData;
	
  return {
    ...modal,
    routine: data?.routine,
  };
}