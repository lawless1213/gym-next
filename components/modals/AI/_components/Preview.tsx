"use client";

import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useModal } from "../../ModalProvider";
import Image from "next/image";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";

type PreviewProps = {
  onChange?: (value: boolean) => void;
};

export function Preview({ onChange }: PreviewProps) {
  const t = useTranslations("ai.modal.subscribe");
  const { params } = useUserPreferences();
  const router = useRouter();
  const { close } = useModal();

  const handlePreviewChange = (value: boolean) => {
    onChange?.(value);
  };

  const toSubscribeHandle = () => {
    router.push("/settings?tab=subscribe");
    close();
  };

  const allowedTries = params.subscribed.freeAiTries;

  return (
    <div className="flex flex-col items-center">
      <Image
        className="invert-50"
        src="/images/trainer.png"
        alt="Logo"
        width={200}
        height={200}
      />
      <p className="my-7 text-center text-foreground">{t("subtitle")}</p>
      <div className="flex w-full flex-col gap-4">
        <Button
          variant="default"
          onClick={() => toSubscribeHandle()}>
          {t("link")}
        </Button>
        {allowedTries ? (
          <Button
            onClick={() => {
              handlePreviewChange(false);
            }}
            variant="outline">
            {t("trial")}
          </Button>
        ) : (
          <Button
            onClick={() => close()}
            variant="outline">
            {t("close")}
          </Button>
        )}
      </div>
      <div className="mt-2 text-center text-xs text-muted-foreground">{t("tries", { count: allowedTries })}</div>
    </div>
  );
}
