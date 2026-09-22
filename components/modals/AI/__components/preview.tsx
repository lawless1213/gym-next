"use client";

import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useModal } from "../../modal-store";
import Image from "next/image";
import { useUserPreferences } from "@/providers/user-preferences-provider";

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

  const allowedTries = params.subscribe.freeAiTries;

  return (
    <div className="flex items-center flex-col">
      <Image
        className="invert-50"
        src="/images/trainer.png"
        alt="Logo"
        width={200}
        height={200}
      />
      <p className="text-foreground text-center my-7">{t("subtitle")}</p>
      <div className="flex flex-col gap-4 w-full">
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
      <div className="text-muted-foreground text-xs text-center mt-2">{t("tries", { count: allowedTries })}</div>
    </div>
  );
}
