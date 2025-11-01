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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="text-6xl">{emoji}</div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={handleGoBack}
            className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            뒤로 가기
          </button>
          <button
            onClick={handleGoHome}
            className="rounded-lg bg-olive-light px-6 py-3 font-medium text-white transition-colors hover:bg-olive-dark"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
