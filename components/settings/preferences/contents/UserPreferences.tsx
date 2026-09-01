"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function UserPreferences() {
  const t = useTranslations("settings.preferences.user");

  const { user } = useAuth();
  const userId = user?.uid;

  const handleDelete = () => {
    toast.warning(t("accountDeleted"));
  };

  const listItems = [
    {
      title: "gender",
      options: ["male", "female"],
    },
    {
      title: "distance",
      options: ["cm", "in"],
    },
    {
      title: "weight",
      options: ["kg", "lb"],
    },
  ];

  return (
    <div className="w-full space-y-2">
      {listItems.map((item) => (
        <div className="flex items-center gap-2 w-full justify-between">
          <span>{t(`${item.title}.title`)}</span>
          <div className="flex items-center gap-2">
            {item.options.map((option) => (
              <Button>{option}</Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
