// Server component: page metadata only. The page itself is client-side (data needs the
// signed-in Firebase user, which exists only in the browser).
import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AuthActionPage from "@/components/auth/AuthActionPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: t("title") };
}

export default function Page() {
  // useSearchParams() inside needs a Suspense boundary.
  return (
    <Suspense>
      <AuthActionPage />
    </Suspense>
  );
}
