import {
  getAccessToken,
  useUserStore,
  removeAccessToken,
} from "@/store/useUserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, postTokenRefresh } from "@/api/user";
import { User } from "@/type/user";
import { AxiosError } from "axios";

export const useUser = () => {
  const { user, setUser, clearUser, setAccessToken } = useUserStore();
  const queryClient = useQueryClient();

  const refreshToken = useMutation({
    mutationFn: postTokenRefresh,
    onSuccess: (data) => {
      setAccessToken(data.token);
      refetch();
    },
    onError: () => {
      removeAccessToken();
      clearUser();
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getMyInfo,
    staleTime: 10 * 60 * 1000,
    enabled: !!getAccessToken(),
    meta: {
      onSuccess: (data: User) => {
        setUser(data);
      },
      onError: (err: AxiosError) => {
        if (err.response?.status === 401) {
          logout();
        }
      },
    },
  });

  const setInitialToken = (token: string) => {
    setAccessToken(token);
    return refetch();
  };

  const logout = () => {
    removeAccessToken();
    clearUser();
    queryClient.removeQueries({ queryKey: ["user"] });
  };

  const refreshTokenOnLoad = async () => {
    return refreshToken
      .mutateAsync()
      .then(() => true)
      .catch(() => false);
  };

  return {
    user,
    isLoading,
    error,
    refetch,
    setInitialToken,
    logout,
    refreshTokenOnLoad,
    isLoggedIn: useUserStore.getState().isLogged,
  };
};
