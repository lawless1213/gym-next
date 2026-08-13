import { useModal } from "@/lib/modal/modal-store";
import { Exercise } from "@/types";

type ExerciseEditModalData = {
  exercise: Exercise;
};

export function useExerciseEditModal() {
  const modal = useModal();
  const data = modal.data as ExerciseEditModalData;
	
  return {
    ...modal,
    exercise: data?.exercise,
  };
}