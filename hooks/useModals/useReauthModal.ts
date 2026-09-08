// hooks/useReauthModal.ts
import { useModal } from "@/components/modals/modal-store";

type ReauthModalData = {
  title?: string;
  description?: string;
  onSuccess: (password: string) => Promise<void>;
};

export function useReauthModal() {
  const modal = useModal();
  const data = modal.data as ReauthModalData | undefined;

  const requestReauth = (options: {
    title?: string;
    description?: string;
    onConfirm: (password: string) => Promise<void>;
  }) => {
    modal.open("reauth", {
      title: options.title,
      description: options.description,
      onSuccess: options.onConfirm,
    });
  };

  return {
    ...modal,
    title: data?.title,
    description: data?.description,
    onSuccess: data?.onSuccess,
    requestReauth,
  };
}