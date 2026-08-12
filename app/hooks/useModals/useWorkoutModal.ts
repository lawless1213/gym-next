import { useModal } from "@/app/lib/modal/modal-store";
import { Routine } from "@/types";

export function useWorkoutModal() {
  const modal = useModal();
  return {
    ...modal,
    routine: modal.data as Routine,
  };
}