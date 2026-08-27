"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

export default function Personal() {
	const t = useTranslations("settings.profile.personal");

	const { user } = useAuth();
	const userId = user?.uid;

	return (
		<div>personal</div>
	);
}
