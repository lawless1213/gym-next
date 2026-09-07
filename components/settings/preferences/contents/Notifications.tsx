"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

export default function Notifications() {
	const t = useTranslations("settings.notifications");

	const { user } = useAuth();
	const userId = user?.uid;

	return (
		<>
			<div className="text-muted-foreground text-xs">Notifications will be available in future</div>	
		</>
	);
}
