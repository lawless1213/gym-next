"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import DeleteUser from "./DeleteUser";
import Personal from "./Personal";
import ConfirmEmail from "./ConfirmEmail";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

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
				<div className="bg-card rounded-2xl">
					<div className="p-4 border-b-2 border-background">
						<div className="font-bold text-primary uppercase">{item.label}</div>
						<div className="text-sm text-muted-foreground">{item.text}</div>
					</div>
					<div className="p-4 flex flex-col gap-3 items-center">
						{item.content}
					</div>
				</div>
			))}
		</div>
	);
}
