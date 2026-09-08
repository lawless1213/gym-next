"use client";

import { ModalWrapper } from "../modal-wrapper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/input";
import { IconBarbell, IconUpload } from "@tabler/icons-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { userFormData, userSchema } from "@/lib/schemas";
import { useUserPreferences } from "@/providers/user-preferences-provider";

export function UserEditModal() {
  const tComponents = useTranslations("components");
  const t = useTranslations("userEdit.modal");
  const { params } = useUserPreferences();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<userFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      photo: params.avatarUrl ?? undefined,
      name: user?.displayName || "",
      height: params?.height ? params?.height : 0
    },
  });

  const { ref: nameRef, ...titleRest } = register("name");
  const { ref: heightRef, ...heightRest } = register("height");

  const onSubmit = async (data: userFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      const photoToSave = data.photo instanceof File ? data.photo : (params.avatarUrl ?? undefined);

      // await editUserExecise(user.uid, exercise.id, {
      //   photo: photoToSave,
      //   name: data.name,
      //   height: data.height,
      // });

      // queryClient.invalidateQueries({ queryKey: ["exercises", user.uid] });
      toast.success(t("success"));
      close();
    } catch (err: any) {
      toast.error(t("error"));
    }
  };

  return (
    <ModalWrapper
      modalType="userEdit"
      title={t("title")}>
      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col static">
          <div className="flex-1 space-y-2 mb-10">
            <Controller
              name="photo"
              control={control}
              render={({ field: { onChange, value } }) => {
                const previewUrl = value instanceof File ? URL.createObjectURL(value) : typeof value === "string" ? value : params.avatarUrl || null;
                return (
                  <label className="group flex flex-col items-center cursor-pointer">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-secondary overflow-hidden">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/60 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl tracking-widest">{user?.displayName?.slice(0, 1)}</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                    <span className="flex items-center gap-2 text-sm font-medium group-hover:text-primary mt-1 transition-[0.2s]">
                      <IconUpload className="h-4 w-4" />
                      {value ? t("changePicture") : t("addPicture")}
                    </span>
                    {errors.photo?.message && <p className="text-xs text-red-500 min-h-5">{errors.photo?.message}</p>}
                  </label>
                );
              }}
            />

            <Input
              ref={nameRef}
              input={{
                ...titleRest,
                id: "title",
                placeholder: t("name"),
                error: errors.name?.message && tComponents("forms." + errors.name?.message),
              }}
            />

            <Input
              ref={heightRef}
              input={{
                ...heightRest,
                type: "tel",
                id: "height",
                placeholder: t("height"),
                error: errors.height?.message && tComponents("forms." + errors.height?.message),
              }}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isDirty || !isValid}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg">
            {t("submit")}
          </Button>
        </form>
      </div>
    </ModalWrapper>
  );
}
