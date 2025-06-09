import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getPresignedUrl, putUserInfo, PutUserInfoPayload } from '@/api/user';
import { uploadFileToS3 } from '@/api/recipe';
import { User } from '@/type/user';
import { useUserStore } from '@/store/useUserStore';

export interface PutUserInfoVariables {
  nickname?: string;
  description?: string;
  profileImageFile?: File;
}

interface UsePutUserInfoMutationProps {
  onSuccess?: (data: User) => void;
  onError?: (error: AxiosError) => void;
}

export const usePutUserInfoMutation = ({
  onSuccess,
  onError,
}: UsePutUserInfoMutationProps = {}) => {
  const queryClient = useQueryClient();
  const { user, setUser } = useUserStore();

  const mutation = useMutation<User, AxiosError, PutUserInfoVariables>({
    mutationFn: async ({
      nickname,
      description,
      profileImageFile,
    }: PutUserInfoVariables): Promise<User> => {
      let profileImageFileKey: string | undefined = undefined;

      if (profileImageFile && user) {
        const presignedUrlInfo = await getPresignedUrl(user.id);
        profileImageFileKey = await uploadFileToS3(
          profileImageFile,
          presignedUrlInfo,
        );
        if (!profileImageFileKey) {
          throw new Error('S3에 프로필 이미지를 업로드하는데 실패했습니다.');
        }
      }

      const payload: PutUserInfoPayload = {};
      const currentNickname = user?.nickname || '';
      const currentIntroduction = user?.introduction || '';

      const hasNicknameChanged =
        nickname !== undefined && nickname !== currentNickname;
      const hasDescriptionChanged =
        description !== undefined && description !== currentIntroduction;
      const hasProfileImageChanged =
        profileImageFileKey !== undefined &&
        profileImageFileKey !== user?.profileImage;

      if (hasNicknameChanged) payload.nickname = nickname;
      if (hasDescriptionChanged) payload.introduction = description;
      if (hasProfileImageChanged) payload.profileImageKey = profileImageFileKey;

      if (
        !hasNicknameChanged &&
        !hasDescriptionChanged &&
        !hasProfileImageChanged
      ) {
        if (user) return user;
        throw new Error('수정할 정보가 없습니다.');
      }

      const updatedUser = await putUserInfo(payload);
      return updatedUser;
    },
    onSuccess: (data: User) => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      setUser(data);
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: AxiosError) => {
      if (onError) {
        onError(error);
      }
      console.error('Error patching user info:', error);
    },
  });
  // mutation 객체와 isLoading 상태를 함께 반환합니다.
  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};
