"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { StickerBookBackground } from "@/entities/recipe";
import { useStickerBookBackgroundsQuery } from "@/entities/recipe";

import { useUpdateStickerBookBackground } from "@/features/cooking-record-background";

export const useCookingRecordBackground = ({
  enabled,
  currentBackground,
  onApplied,
  onError,
}: {
  enabled: boolean;
  currentBackground: StickerBookBackground | null;
  onApplied: () => void;
  onError: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>();
  const backgroundsQuery = useStickerBookBackgroundsQuery({
    enabled: enabled && isOpen,
  });
  const updateMutation = useUpdateStickerBookBackground();
  const backgrounds = backgroundsQuery.data?.items ?? [];
  const serverSelectedKey = backgrounds.find(
    (item) => item.selected
  )?.backgroundKey;
  const selectedBackgroundKey =
    selectedKey ?? serverSelectedKey ?? currentBackground?.backgroundKey;
  const previewBackground =
    backgrounds.find((item) => item.backgroundKey === selectedBackgroundKey) ??
    currentBackground;

  const open = () => {
    setSelectedKey(undefined);
    setIsOpen(true);
  };

  const apply = async () => {
    if (!selectedBackgroundKey) return;
    try {
      await updateMutation.mutateAsync({
        backgroundKey: selectedBackgroundKey,
      });
      triggerHaptic("Success");
      setIsOpen(false);
      onApplied();
    } catch {
      triggerHaptic("Error");
      onError();
    }
  };

  return {
    isOpen,
    open,
    onOpenChange: setIsOpen,
    backgrounds,
    selectedBackgroundKey,
    previewBackground,
    selectBackground: setSelectedKey,
    apply,
    isListPending: backgroundsQuery.isPending,
    isListError: backgroundsQuery.isError,
    retryList: backgroundsQuery.refetch,
    isApplying: updateMutation.isPending,
  };
};
