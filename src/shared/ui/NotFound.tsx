"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useDeleteNotification } from "@/entities/notification";

type NotFoundWithNotificationProps = {
  title: string;
  description: string;
  emoji?: string;
};

const NotFound = ({
  title,
  description,
  emoji = "🚫",
}: NotFoundWithNotificationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notificationId = searchParams.get("notificationId");

  const { mutate: deleteNotification } = useDeleteNotification();

  useEffect(() => {
    if (notificationId) {
      deleteNotification(Number(notificationId));
    }
  }, [notificationId, deleteNotification]);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="text-6xl">{emoji}</div>
        <h1 className="text-ink text-2xl font-bold">{title}</h1>
        <p className="text-ink-sub">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={handleGoBack}
            className="text-ink-sub rounded-lg bg-gray-100 px-6 py-3 font-medium transition-colors hover:bg-gray-200"
          >
            뒤로 가기
          </button>
          <button
            onClick={handleGoHome}
            className="bg-olive-light hover:bg-olive-dark rounded-lg px-6 py-3 font-medium text-white transition-colors"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
