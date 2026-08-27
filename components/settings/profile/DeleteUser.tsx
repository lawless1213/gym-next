"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

export default function DeleteUser() {
	const t = useTranslations("settings.profile.delete");

	const { user } = useAuth();
	const userId = user?.uid;

	return (
		<Button variant="destructive" disabled>
			{t('confirm')}
		</Button>
	);
}
