"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import DeleteUser from "./DeleteUser";
import Personal from "./Personal";
import ConfirmEmail from "./ConfirmEmail";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import SettingsSection from "../SettingsSection";

export default function Profile() {
	const t = useTranslations("settings.profile");

	const { user } = useAuth();
	const userId = user?.uid;

	const sectionItems = [
		{
      id: "personal",
      label: t("personal.title"),
      text: t("personal.text"),
			content: <Personal/>
    },
		{
      id: "confirmEmail",
      label: t("email.confirm.title"),
      text: t("email.confirm.text"),
			content: <ConfirmEmail/>
    },
    {
      id: "changeEmail",
      label: t("email.change.title"),
      text: t("email.change.text"),
			content: <ChangeEmail/>
		},
    {
      id: "password",
      label: t("password.title"),
      text: t("password.text"),
			content: <ChangePassword/>
    },
    {
      id: "delete",
      label: t("delete.title"),
      text: t("delete.text"),
			content: <DeleteUser/>
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
