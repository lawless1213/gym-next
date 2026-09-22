"use client";

import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useModal } from "../../modal-store";
import Image from "next/image";

export function Preview() {
  const t = useTranslations("ai.modal.subscribe");
  const router = useRouter();
	const { close } = useModal();

	const toSubscribeHandle = () => {
		router.push("/settings?tab=subscribe");
		close();
	}
	

  const maxAmount = 3;
  const amount = 1;
	const allowedTries = maxAmount - amount;

  return (
    <div className="flex items-center flex-col gap-4">
			<Image className="invert-50" src="/images/trainer.png" alt="Logo" width={200} height={200} />

      <p className="text-muted-foreground  text-center">{t("subtitle")}</p>

      <div className="flex flex-col gap-2 w-full">
        {
          allowedTries ? <Button variant="outline">{t("trial", { count: allowedTries })}</Button> : <Button onClick={() => close()} variant="outline">{t("close")}</Button> 
				}
        <Button
          variant="default"
          onClick={() => toSubscribeHandle()}>
          {t("link")}
        </Button>
      </div>
    </div>
  );
}
