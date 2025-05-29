import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { Camera } from 'lucide-react'; // lucide-react 아이콘 사용 유지
import { useUserStore } from '@/store/useUserStore';

interface FormValues {
  nickname: string;
  description: string;
  profileImage?: FileList;
}

const MAX_NICKNAME_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 60;

const UserInfoChangePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const initialData = {
    nickname: user?.nickname || '',
    description: user?.introduction || '',
    profileImageUrl: user?.profileImage || '',
  };
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      nickname: initialData.nickname,
      description: initialData.description,
    },
  });

  useEffect(() => {
    setValue('nickname', initialData.nickname);
    setValue('description', initialData.description);
  }, [initialData, setValue]);

  const nickname = watch('nickname');
  const description = watch('description');

  const onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
    // TODO: API 호출하여 사용자 정보 업데이트
    // navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <button
          type="button"
          onClick={handleCancel}
          className="cursor-pointer border-none bg-transparent text-base text-blue-500"
        >
          취소
        </button>
        <h1 className="m-0 text-lg font-bold">프로필 변경</h1>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          className={`border-none bg-transparent text-base font-bold ${
            isValid
              ? 'cursor-pointer text-blue-500'
              : 'cursor-default text-gray-400'
          }`}
        >
          확인
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-grow flex-col pt-20"
      >
        {/* Profile Image Section */}
        <div className="relative z-[3] pl-4">
          <div
            className={`relative flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-cover bg-center ${
              initialData.profileImageUrl ? 'bg-transparent' : 'bg-gray-300' // #BDBDBD와 유사한 색상
            }`}
            style={
              initialData.profileImageUrl
                ? { backgroundImage: `url(${initialData.profileImageUrl})` }
                : {}
            }
          >
            <Controller
              name="profileImage"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <input
                  {...restField}
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                  className="hidden"
                />
              )}
            />
            {!initialData.profileImageUrl && (
              <Camera className="z-10 h-10 w-10 text-gray-500" />
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="mt-4 flex-grow p-4">
          {/* Nickname Field */}
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
                required: '닉네임을 입력해주세요.',
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
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
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

          {/* Description Field */}
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
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
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
