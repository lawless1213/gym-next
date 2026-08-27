"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

export default function Preferences() {
	const t = useTranslations("settings.preferences");

	const { user } = useAuth();
	const userId = user?.uid;

	return (
		<>
			<div>Preferences</div>	
		</>
	);
}
