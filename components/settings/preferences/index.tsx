"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import SettingsSection from "../SettingsSection";
import Appearance from "./appearance";
import UserPreferences from "./UserPreferences";

export default function Profile() {
	const t = useTranslations("settings.preferences");

	const { user } = useAuth();
	const userId = user?.uid;

	const sectionItems = [
		{
      id: "appearance",
      label: t("appearance.title"),
      text: t("appearance.text"),
			content: <Appearance/>
    },
    {
      id: "userPreferences",
      label: t("userPreferences.title"),
      text: t("userPreferences.text"),
			content: <UserPreferences/>
    },
  ];

	return (
		<div className="space-y-4">
			{sectionItems.map(item => (
				<SettingsSection key={item.label} label={item.label} text={item.text} content={item.content} />
			))}
		</div>
	);
}
