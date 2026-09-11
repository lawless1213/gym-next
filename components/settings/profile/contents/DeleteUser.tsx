"use client";

import { useModal } from "@/components/modals/modal-store";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useReauthModal } from "@/hooks/useModals/useReauthModal";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DeleteUser() {
	const t = useTranslations("settings.profile.delete");
 	const { requestReauth } = useReauthModal();
  const { deleteAccount } = useAuth();

  const handleDelete = () => {
    requestReauth({
      title: t("confirmTitle"),
      description: t("confirmDescription"),
      onConfirm: async (password: string) => {
        await deleteAccount(password);
        toast.success(t('accountDeleted'));
      },
    });
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}>
      {t("submit")}
    </Button>
  );
}
