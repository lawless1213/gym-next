"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import DeleteUser from "./contents/DeleteUser";
import Personal from "./Personal";
import ConfirmEmail from "./ConfirmEmail";
import ChangeEmail from "./contents/ChangeEmail";
import ChangePassword from "./contents/ChangePassword";
import SettingsSection from "../SettingsSection";
import { IconAt, IconLock, IconTrash } from '@tabler/icons-react';

export default function Profile() {
	const t = useTranslations("settings.profile");

	const { user } = useAuth();
	const userId = user?.uid;

	const sectionItems = [
    {
      id: "changeEmail",
      label: t("email.change.title"),
			icon: IconAt,
      text: t("email.change.text"),
			content: <ChangeEmail/>
		},
    {
      id: "password",
      label: t("password.title"),
			icon: IconLock,
      text: t("password.text"),
			content: <ChangePassword/>
    },
    {
      id: "delete",
      label: t("delete.title"),
			icon: IconTrash,
      text: t("delete.text"),
			content: <DeleteUser/>,
			labelColor: "text-destructive"
    },
  ];

	return (
		<div className="space-y-4">
			<Personal/>
			<ConfirmEmail/>
			{sectionItems.map(item => (
				<SettingsSection key={item.label} label={item.label} icon={item.icon} text={item.text} content={item.content} labelColor={item.labelColor} />
			))}
		</div>
	);
}
