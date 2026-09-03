"use client";

import { Select } from "@/components/ui/form/select";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/providers/user-preferences-provider";
import { useTranslations } from "next-intl";

export default function UserPreferences() {
  const { params, updateParam } = useUserPreferences();
  const t = useTranslations("settings.preferences.user");
  const tComponents = useTranslations("components");

  const { user } = useAuth();
  const userId = user?.uid;

  const handleGenderChange = async (gender: string) => {
    if (gender !== "male" && gender !== "female") return;

    await updateParam("gender", gender);
  };

  const handleDistanceChange = async (distance: string) => {
    if (distance !== "cm" && distance !== "in") return;

    await updateParam("distance", distance);
  };

  const handleWeightChange = async (weight: string) => {
    if (weight !== "kg" && weight !== "lb") return;

    await updateParam("weight", weight);
  };

  const listItems = [
    {
      title: "gender",
      options: ["male", "female"],
      onchange: handleGenderChange,
      value: params.gender,
    },
    {
      title: "distance",
      options: ["cm", "in"],
      onchange: handleDistanceChange,
      value: params.distance,
    },
    {
      title: "weight",
      options: ["kg", "lb"],
      onchange: handleWeightChange,
      value: params.weight,
    },
  ];

  return (
    <div className="w-full space-y-2">
      {listItems.map((item) => (
        <div className="flex items-center gap-2 w-full justify-between">
          <span>{t(`${item.title}.title`)}</span>
          <div className="flex items-center gap-2">
            <Select
              input={{
                id: item.title,
                searchable: false,
                value: item.value,
                onChange: item.onchange,
                options: item.options.map((opt) => ({ value: opt, label: tComponents(`${item.title}.${opt}`) })),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
