// Server component: page metadata only. The page itself is client-side (data needs the
// signed-in Firebase user, which exists only in the browser).
import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SettingsPage from "@/components/settings/SettingsPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("components.bottomNav");
  return { title: t("settings") };
}

export default function Page() {
  // useSearchParams() inside needs a Suspense boundary.
  return (
    <Suspense>
      <SettingsPage />
    </Suspense>
  );
}
