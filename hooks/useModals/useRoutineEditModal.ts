import { useModal } from  "@/components/modals/modal-store";
import { Routine } from "@/types";

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