"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useLocalizedRouter } from "@/shared/i18n";
import { useNotFoundDict } from "@/shared/i18n/useNotFoundDict";

import { useDeleteNotification } from "@/entities/notification";

type NotFoundKey = "recipe" | "generic";

type NotFoundProps = {
  titleKey?: NotFoundKey;
  descriptionKey?: NotFoundKey;
  emoji?: string;
};

const NotFound = ({
  titleKey = "generic",
  descriptionKey = "generic",
  emoji = "🚫",
}: NotFoundProps) => {
  const t = useNotFoundDict();
  const router = useLocalizedRouter();
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
        <h1 className="text-ink text-2xl font-bold">{t[titleKey].title}</h1>
        <p className="text-ink-sub">{t[descriptionKey].description}</p>
        <div className="flex gap-3">
          <button
            onClick={handleGoBack}
            className="text-ink-sub rounded-lg bg-gray-100 px-6 py-3 font-medium transition-colors hover:bg-gray-200"
          >
            {t.goBack}
          </button>
          <button
            onClick={handleGoHome}
            className="bg-olive-light hover:bg-olive-dark rounded-lg px-6 py-3 font-medium text-white transition-colors"
          >
            {t.goHome}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
