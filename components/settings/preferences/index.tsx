"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import SettingsSection from "../SettingsSection";
import Appearance from "./contents/Appearance";
import UserPreferences from "./contents/UserPreferences";
import { IconSparkles, IconSettingsSpark, IconBell } from '@tabler/icons-react';
import Notifications from "./contents/Notifications";

export default function Profile() {
	const t = useTranslations("settings.preferences");

	const { user } = useAuth();
	const userId = user?.uid;

	const sectionItems = [
		{
      id: "appearance",
      label: t("appearance.title"),
      icon: IconSparkles,
      text: t("appearance.text"),
			content: <Appearance/>
    },
    {
      id: "userPreferences",
      label: t("user.title"),
      icon: IconSettingsSpark,
      text: t("user.text"),
			content: <UserPreferences/>
    },
    {
      id: "notifications",
      label: t("notifications.title"),
      icon: IconBell,
      text: t("notifications.text"),
			content: <Notifications/>
    },
  ];

	return (
		<div className="space-y-4">
			{sectionItems.map(item => (
				<SettingsSection key={item.label} icon={item.icon} label={item.label} text={item.text} content={item.content} />
			))}
		</div>
	);
}
