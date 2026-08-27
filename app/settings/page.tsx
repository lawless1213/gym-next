"use client";

import { useState } from "react";
import { IconAdjustmentsHorizontal, IconStar, IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Tabs } from "@/components/ui/Tabs";
import Profile from "@/components/settings/profile";
import Preferences from "@/components/settings/preferences";
import Subscribe from "@/components/settings/subscribe";

type SettingsTab = "profile" | "preferences" | "subscribe";

export default function Setting() {
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabItems = [
    {
      id: "subscribe",
      label: t("tabs.preferences"),
      icon: <IconStar className="size-4" />,
    },
    {
      id: "profile",
      label: t("tabs.profile"),
      icon: <IconUser className="size-4" />,
    },
    {
      id: "preferences",
      label: t("tabs.preferences"),
      icon: <IconAdjustmentsHorizontal className="size-4" />,
    },
  ];

  const content: Record<SettingsTab, React.ReactNode> = {
    profile: <Profile />,
    preferences: <Preferences />,
    subscribe: <Subscribe />,
  };

  return (
    <div className="flex flex-col gap-2 pb-4">
      <Tabs
        items={tabItems}
        activeTab={activeTab}
        onChange={setActiveTab}>
        {content[activeTab]}
      </Tabs>
    </div>
  );
}
