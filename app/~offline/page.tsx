import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// Shown by the service worker (app/sw.ts) when a page was never visited and there is no network.
// Pages visited before open from the SW cache instead.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("offline");
  return { title: t("title") };
}

export default async function OfflinePage() {
  const t = await getTranslations("offline");
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
    </div>
  );
}
