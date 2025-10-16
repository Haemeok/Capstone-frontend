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
  const { data, error, hasNextPage, isFetching, isFetchingNextPage, ref } =
    useInfiniteScroll<
      NotificationResponse,
      Error,
      InfiniteData<NotificationResponse>,
      readonly ["notifications", "list", NotificationsParams],
      number
    >({
      queryKey: NOTIFICATION_QUERY_KEYS.notificationList(params),
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
    isFetching,
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
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
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
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });

      const previousData = queryClient.getQueriesData({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });

      queryClient.setQueriesData<InfiniteData<NotificationResponse>>(
        { queryKey: NOTIFICATION_QUERY_KEYS.notifications },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: page.content.filter((n) => n.id !== notificationId),
            })),
          };
        }
      );

      return { previousData };
    },
    onError: (error: Error, _notificationId, context) => {
      console.error("Failed to delete notification:", error);
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllNotifications,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });

      const previousData = queryClient.getQueriesData({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });

      queryClient.setQueriesData<InfiniteData<NotificationResponse>>(
        { queryKey: NOTIFICATION_QUERY_KEYS.notifications },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              content: [],
            })),
          };
        }
      );

      return { previousData };
    },
    onError: (error: Error, _variables, context) => {
      console.error("Failed to delete all notifications:", error);
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.notifications,
      });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
    },
  });
};
