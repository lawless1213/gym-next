"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";

export default function Subscribe() {
	const t = useTranslations("settings.subscribe");

	const { user } = useAuth();
	const userId = user?.uid;

	return (
		<>
			<div>Subscribe</div>	
		</>
	);
}
