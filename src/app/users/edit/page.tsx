"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Camera } from "lucide-react";

import { ApiError } from "@/shared/api/client";
import { getErrorData } from "@/shared/api/errors";
import { format, useUserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Container } from "@/shared/ui/Container";

import { useUserStore } from "@/entities/user";

import { usePutUserInfoMutation } from "@/features/user-edit/model/hooks";
import { PutUserInfoVariables } from "@/features/user-edit/model/types";

import { useToastStore } from "@/shared/ui/toast";

interface FormValues {
  nickname: string;
  description: string;
  profileImage?: FileList;
}

const MAX_NICKNAME_LENGTH = 12;
const MAX_DESCRIPTION_LENGTH = 200;
const DUPLICATE_NICKNAME_CODE = "102";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const UserInfoChangePage = () => {
  const t = useUserPagesDict().profile.edit;
  const router = useRouter();
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    user?.profileImage || null
  );
  const [imageError, setImageError] = useState<string | null>(null);

  const initialData = useMemo(
    () => ({
      nickname: user?.nickname || "",
      description: user?.introduction || "",
      profileImageUrl: user?.profileImage || "",
    }),
    [user]
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: initialData,
  });

  useEffect(() => {
    setValue("nickname", initialData.nickname);
    setValue("description", initialData.description);
    setPreviewImageUrl(initialData.profileImageUrl);
    setProfileImageFile(null);
  }, [initialData, setValue]);

  const { mutate: putUserInfo, isLoading } = usePutUserInfoMutation({
    onSuccess: () => {
      triggerHaptic("Success");
      router.back();
    },
    onError: (error: ApiError) => {
      triggerHaptic("Error");
      const errorData = getErrorData(error);

      if (String(errorData?.code) === DUPLICATE_NICKNAME_CODE) {
        setError("nickname", {
          type: "server",
          message: errorData!.message,
        });
      } else {
        addToast({
          message: t.updateError,
          variant: "error",
        });
      }
    },
  });

  const nickname = watch("nickname");
  const description = watch("description");

  const hasChanges =
    nickname !== initialData.nickname ||
    description !== initialData.description ||
    profileImageFile !== null;

  const onSubmit = (data: FormValues) => {
    const changedData: PutUserInfoVariables = {};
    let hasChanges = false;

    if (data.nickname !== initialData.nickname) {
      changedData.nickname = data.nickname;
      hasChanges = true;
    }
    if (data.description !== initialData.description) {
      changedData.description = data.description;
      hasChanges = true;
    }
    if (profileImageFile) {
      changedData.profileImageFile = profileImageFile;
      hasChanges = true;
    }

    if (!hasChanges) {
      return;
    }
    putUserInfo(changedData);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <div className="z-header sticky-optimized fixed top-0 right-0 left-0 border-b border-gray-200 bg-white p-4 md:relative md:z-auto">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="text-ink-sub cursor-pointer border-none bg-transparent text-base"
          >
            {t.cancel}
          </button>
          <h1 className="m-0 text-lg font-bold">{t.heading}</h1>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || !hasChanges || isLoading}
            className={`border-none bg-transparent text-base font-semibold ${
              isValid && hasChanges && !isLoading
                ? "text-olive-light cursor-pointer"
                : "cursor-default text-gray-300"
            }`}
          >
            {isLoading ? t.submitting : t.submit}
          </button>
        </div>
      </div>

      <Container>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-grow flex-col pt-20 md:pt-0"
        >
          <div className="relative z-[3] pl-4">
            <label
              htmlFor="profileImageInput"
              className="block h-[100px] w-[100px] cursor-pointer"
            >
              <div
                className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] bg-cover bg-center transition-colors ${imageError ? "border-red-400" : "border-white"} ${
                  previewImageUrl ? "bg-transparent" : "bg-gray-300"
                }`}
                style={
                  previewImageUrl
                    ? { backgroundImage: `url(${previewImageUrl})` }
                    : {}
                }
              >
                {!previewImageUrl && (
                  <Camera className="text-ink-muted z-10 h-10 w-10" />
                )}
              </div>
            </label>
            <Controller
              name="profileImage"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <input
                  {...restField}
                  id="profileImageInput"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                        setImageError(t.imageFormatError);
                        triggerHaptic("Error");
                        e.target.value = "";
                        return;
                      }
                      setImageError(null);
                      setProfileImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewImageUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                      onChange(e.target.files);
                    } else {
                      setProfileImageFile(null);
                      setPreviewImageUrl(initialData.profileImageUrl);
                      onChange(null);
                    }
                  }}
                  className="hidden"
                />
              )}
            />
            {imageError && (
              <p className="mt-2 text-xs text-red-500">{imageError}</p>
            )}
          </div>

          <div className="mt-4 flex-grow p-4">
            <div className="mb-6">
              <label
                htmlFor="nickname"
                className="text-ink-sub mb-1 block text-sm"
              >
                {t.nameLabel}
              </label>
              <Controller
                name="nickname"
                control={control}
                rules={{
                  required: t.nicknameRequired,
                  maxLength: {
                    value: MAX_NICKNAME_LENGTH,
                    message: format(t.nicknameTooLong, {
                      max: MAX_NICKNAME_LENGTH,
                    }),
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="nickname"
                    type="text"
                    onChange={(e) => {
                      field.onChange(e);
                      if (errors.nickname?.type === "server") {
                        clearErrors("nickname");
                      }
                    }}
                    className={`focus:border-olive-light focus:ring-olive-light/20 w-full rounded-lg border bg-gray-50 p-3 text-base transition-colors focus:bg-white focus:ring-1 focus:outline-none ${
                      errors.nickname
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200"
                    }`}
                  />
                )}
              />
              <div className="mt-1 flex justify-between">
                {errors.nickname && (
                  <p className="m-0 text-xs text-red-500">
                    {errors.nickname.message}
                  </p>
                )}
                <p className="text-ink-muted m-0 ml-auto text-xs">
                  {nickname?.length || 0}/{MAX_NICKNAME_LENGTH}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="text-ink-sub mb-1 block text-sm"
              >
                {t.introLabel}
              </label>
              <Controller
                name="description"
                control={control}
                rules={{
                  maxLength: {
                    value: MAX_DESCRIPTION_LENGTH,
                    message: format(t.introTooLong, {
                      max: MAX_DESCRIPTION_LENGTH,
                    }),
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    placeholder={t.introPlaceholder}
                    rows={5}
                    className={`focus:border-olive-light focus:ring-olive-light/20 w-full resize-none rounded-lg border bg-gray-50 p-3 text-base transition-colors focus:bg-white focus:ring-1 focus:outline-none ${
                      errors.description
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200"
                    }`}
                  />
                )}
              />
              <div className="mt-1 flex justify-between">
                {errors.description && (
                  <p className="m-0 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
                <p className="text-ink-muted m-0 ml-auto text-xs">
                  {description?.length || 0}/{MAX_DESCRIPTION_LENGTH}
                </p>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default UserInfoChangePage;
