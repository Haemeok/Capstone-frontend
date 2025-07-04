import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { AxiosError } from "axios";
import { Camera } from "lucide-react";

import { useUserStore } from "@/entities/user";

import { usePutUserInfoMutation } from "@/features/user-edit/model/hooks";
import { PutUserInfoVariables } from "@/features/user-edit/model/types";

interface FormValues {
  nickname: string;
  description: string;
  profileImage?: FileList;
}

const MAX_NICKNAME_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 600;

interface ApiErrorData {
  message?: string;
}

const UserInfoChangePage = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(
    user?.profileImage || null
  );

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
      router.back();
    },
    onError: (error: AxiosError) => {
      const apiError = error.response?.data as ApiErrorData | undefined;
      apiError?.message || "프로필 업데이트에 실패했습니다.";
    },
  });

  const nickname = watch("nickname");
  const description = watch("description");

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
    <div className="flex min-h-screen flex-col bg-white">
      <div className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <button
          type="button"
          onClick={handleCancel}
          className="text-olive-mint cursor-pointer border-none bg-transparent text-base font-semibold"
        >
          취소
        </button>
        <h1 className="m-0 text-lg font-bold">프로필 변경</h1>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          className={`border-none bg-transparent text-base font-semibold ${
            isValid && !isLoading
              ? "text-olive-mint cursor-pointer"
              : "cursor-default text-gray-400"
          }`}
        >
          {isLoading ? "저장 중..." : "확인"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-grow flex-col pt-20"
      >
        <div className="relative z-[3] pl-4">
          <label htmlFor="profileImageInput" className="cursor-pointer">
            <div
              className={`relative flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-cover bg-center ${
                previewImageUrl ? "bg-transparent" : "bg-gray-300"
              }`}
              style={
                previewImageUrl
                  ? { backgroundImage: `url(${previewImageUrl})` }
                  : {}
              }
            >
              {!previewImageUrl && (
                <Camera className="z-10 h-10 w-10 text-gray-500" />
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
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
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
        </div>

        <div className="mt-4 flex-grow p-4">
          <div className="mb-6">
            <label
              htmlFor="nickname"
              className="mb-1 block text-sm text-gray-600"
            >
              이름
            </label>
            <Controller
              name="nickname"
              control={control}
              rules={{
                required: "닉네임을 입력해주세요.",
                maxLength: {
                  value: MAX_NICKNAME_LENGTH,
                  message: `닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.`,
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  id="nickname"
                  type="text"
                  className={`w-full border-b border-none p-3 text-base focus:outline-none ${
                    errors.nickname
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
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
              <p className="m-0 ml-auto text-xs text-gray-500">
                {nickname?.length || 0}/{MAX_NICKNAME_LENGTH}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-1 block text-sm text-gray-600"
            >
              소개
            </label>
            <Controller
              name="description"
              control={control}
              rules={{
                maxLength: {
                  value: MAX_DESCRIPTION_LENGTH,
                  message: `소개는 ${MAX_DESCRIPTION_LENGTH}자 이하로 입력해주세요.`,
                },
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="description"
                  placeholder="소개를 입력해주세요."
                  rows={3}
                  className={`w-full resize-none border-b border-none p-3 text-base focus:outline-none ${
                    errors.description
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
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
              <p className="m-0 ml-auto text-xs text-gray-500">
                {description?.length || 0}/{MAX_DESCRIPTION_LENGTH}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserInfoChangePage;
