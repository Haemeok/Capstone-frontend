"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadNotificationCount,
  type GetNotificationsParams,
  type GetNotificationsResponse,
} from "./api";
import { useNotificationStore } from "./store";
import { InfiniteData } from "@tanstack/react-query";

/**
 * 알림 관련 Query Key 상수들
 */
export const NOTIFICATION_QUERY_KEYS = {
  notifications: ["notifications"] as const,
  notificationList: (params: GetNotificationsParams) =>
    ["notifications", "list", params] as const,
  unreadCount: ["notifications", "unread-count"] as const,
} as const;

/**
 * 알림 목록을 조회하는 훅
 */
export const useNotifications = (params: GetNotificationsParams = {}) => {
  const { setNotifications, setError } = useNotificationStore();

  const query = useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.notificationList(params),
    queryFn: () => getNotifications(params),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });

  // 데이터가 성공적으로 로드되었을 때 store 업데이트
  useEffect(() => {
    if (query.data && query.isSuccess) {
      // 첫 로드 시에만 store 업데이트 (cursor가 없는 경우)
      if (!params.cursor) {
        setNotifications(query.data.notifications);
      }
      setError(null);
    }
  }, [query.data, query.isSuccess, params.cursor, setNotifications, setError]);

  // 에러 발생 시 store 업데이트
  useEffect(() => {
    if (query.error) {
      setError(query.error.message);
    }
  }, [query.error, setError]);

  return query;
};

/**
 * 무한스크롤용 알림 목록 훅
 */
export const useInfiniteNotifications = (
  params: Omit<GetNotificationsParams, "cursor"> = {}
) => {
  const { setNotifications, setError } = useNotificationStore();

  const infiniteQuery = useInfiniteScroll<
    GetNotificationsResponse,
    Error,
    InfiniteData<GetNotificationsResponse>,
    string[],
    string | undefined
  >({
    queryKey: [NOTIFICATION_QUERY_KEYS.notificationList(params).join("-")],
    queryFn: ({ pageParam }) =>
      getNotifications({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    threshold: 0.8,
  });

  // 첫 페이지 데이터가 로드되었을 때 store 업데이트
  useEffect(() => {
    if (infiniteQuery.data && infiniteQuery.data.pages.length > 0) {
      const firstPage = infiniteQuery.data.pages[0];
      setNotifications(firstPage.notifications);
      setError(null);
    }
  }, [infiniteQuery.data, setNotifications, setError]);

  // 에러 발생 시 store 업데이트
  useEffect(() => {
    if (infiniteQuery.error) {
      setError(infiniteQuery.error.message);
    }
  }, [infiniteQuery.error, setError]);

  // 모든 페이지의 알림을 평면화
  const allNotifications =
    infiniteQuery.data?.pages.flatMap((page) => page?.notifications ?? []) ??
    [];

  return {
    ...infiniteQuery,
    notifications: allNotifications,
    totalCount: infiniteQuery.data?.pages[0]?.totalCount ?? 0,
    unreadCount: infiniteQuery.data?.pages[0]?.unreadCount ?? 0,
  };
};

/**
 * 읽지 않은 알림 개수를 조회하는 훅
 */
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: getUnreadNotificationCount,
    staleTime: 1000 * 60 * 2, // 2분
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
  });
};

/**
 * 알림 읽음 처리 뮤테이션
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { markAsRead } = useNotificationStore();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
      // 낙관적 업데이트
      markAsRead(notificationId);

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
    },
    onError: (error: Error) => {
      console.error("Failed to mark notification as read:", error);
    },
  });
};

/**
 * 모든 알림 읽음 처리 뮤테이션
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { markAllAsRead } = useNotificationStore();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // 낙관적 업데이트
      markAllAsRead();

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
    },
    onError: (error: Error) => {
      console.error("Failed to mark all notifications as read:", error);
    },
  });
};

/**
 * 알림 삭제 뮤테이션
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { deleteNotification: deleteFromStore } = useNotificationStore();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, notificationId) => {
      // 낙관적 업데이트
      deleteFromStore(notificationId);

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
    },
    onError: (error: Error) => {
      console.error("Failed to delete notification:", error);
    },
  });
};

/**
 * 모든 알림 삭제 뮤테이션
 */
export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  const { clearAllNotifications } = useNotificationStore();

  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      // 낙관적 업데이트
      clearAllNotifications();

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
    },
    onError: (error: Error) => {
      console.error("Failed to delete all notifications:", error);
    },
  });
};
