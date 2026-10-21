// Server component: page metadata only. The page itself is client-side (data needs the
// signed-in Firebase user, which exists only in the browser).
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HistoryPage from "@/components/history/HistoryPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("components.bottomNav");
  return { title: t("history") };
}

export default function Page() {
  return <HistoryPage />;
}
