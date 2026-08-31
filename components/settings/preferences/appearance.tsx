"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { IconEdit } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function Appearance() {
  const t = useTranslations("settings.preferences.appearance");

  const { user } = useAuth();
  const userId = user?.uid;

  const editHandler = () => {};

  return (
    <>Appearance</>
  );
}
