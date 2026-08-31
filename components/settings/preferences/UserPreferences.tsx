"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function UserPreferences() {
	const t = useTranslations("settings.preferences.user");

	const { user } = useAuth();
	const userId = user?.uid;

	const handleDelete = () => {
    toast.warning(t("accountDeleted"));
  };

	return (
		<>userPreferences</>
	);
}
