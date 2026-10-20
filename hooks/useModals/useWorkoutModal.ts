import { useModal } from "@/components/modals/ModalProvider";
import { Routine } from "@/types";

export function useWorkoutModal() {
  const modal = useModal();
  return {
    ...modal,
    routine: modal.data as Routine,
  };
}
