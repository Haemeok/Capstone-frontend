import { NotificationItem } from "@/entities/notification";
import type { Notification } from "@/entities/notification/model/type";
import { useNotificationList } from "../model/hooks";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger";

type NotificationListProps = {
  onNotificationClick?: (notification: Notification) => void;
  showActions?: boolean;
  emptyMessage?: string;
  className?: string;
};

export const NotificationList = ({
  onNotificationClick,
  showActions = true,
  emptyMessage = "알림이 없습니다.",
  className = "",
}: NotificationListProps) => {
  const {
    notifications,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    ref: infiniteScrollRef,
    refetch,
    markAsReadMutation,
    deleteNotificationMutation,
    handleNotificationClick,
    handleDeleteNotification,
  } = useNotificationList();

  console.log(notifications);

  if (isPending) {
    return (
      <div className={className}>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} className={className} />;
  }

  if (!notifications.length) {
    return <EmptyState message={emptyMessage} className={className} />;
  }

  return (
    <div className={className}>
      <div className="divide-y divide-gray-100">
        {notifications.map((notification: Notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={markAsReadMutation.mutate}
            onDelete={handleDeleteNotification}
            onClick={(notification) =>
              handleNotificationClick(notification, onNotificationClick)
            }
            showActions={showActions}
          />
        ))}
      </div>

      <InfiniteScrollTrigger
        ref={infiniteScrollRef}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};
