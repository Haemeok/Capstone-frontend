"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { getNextPageParam } from "@/shared/lib/utils";

import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationsParams,
} from "./api";
import { NotificationResponse } from "./type";

export const NOTIFICATION_QUERY_KEYS = {
  notifications: ["notifications"] as const,
  notificationList: (params: NotificationsParams) =>
    ["notifications", "list", params] as const,
  unreadCount: ["notifications", "unread-count"] as const,
} as const;

export const useInfiniteNotificationsQuery = (
  params: NotificationsParams = {}
) => {
  const { data, error, hasNextPage, isFetchingNextPage, ref } =
    useInfiniteScroll<
      NotificationResponse,
      Error,
      InfiniteData<NotificationResponse>,
      string[],
      number
    >({
      queryKey: [NOTIFICATION_QUERY_KEYS.notificationList(params).join("-")],
      queryFn: ({ pageParam }) => getNotifications({ ...params, pageParam }),
      getNextPageParam: getNextPageParam,
      initialPageParam: 0,
      threshold: 0.8,
    });

  const allNotifications =
    data?.pages.flatMap((page) => page?.content ?? []) ?? [];

  return {
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    ref,
    notifications: allNotifications,
    totalCount: data?.pages[0]?.page.totalElements ?? 0,
    unreadCount: data?.pages[0]?.page.totalElements ?? 0,
  };
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: getUnreadNotificationCount,
    staleTime: 1000 * 60 * 2, // 2분
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
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

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
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

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, notificationId) => {
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

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
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
