"use client";

import { useModal } from "@/components/modals/modal-store";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DeleteUser() {
  const t = useTranslations("settings.profile.delete");
  const { open, confirm } = useModal();

  const { user, deleteAccount } = useAuth();
  const userId = user?.uid;

  const handleDelete = async () => {
    try {
      if (!user) throw new Error("Not authenticated");

      const ok = await confirm({
        title: t("confirm"),
      });

      if (ok) {
        // deleteAccount();
        toast.warning(t("accountDeleted"));
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={() => handleDelete()}>
      {t("submit")}
    </Button>
  );
}
