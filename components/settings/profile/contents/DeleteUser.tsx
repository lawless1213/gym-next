"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function DeleteUser() {
	const t = useTranslations("settings.profile.delete");

	const { user } = useAuth();
	const userId = user?.uid;

	const handleDelete = () => {
    toast.warning(t("accountDeleted"));
  };

	return (
		<Button variant="destructive" onClick={() => handleDelete()}>
			{t('submit')}
		</Button>
	);
}
