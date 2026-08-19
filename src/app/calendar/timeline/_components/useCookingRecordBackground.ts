"use client";

import { useState } from "react";

import { isApiErrorWithCode } from "@/shared/api/errors";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { StickerBookBackground } from "@/entities/recipe";
import { useStickerBookBackgroundsQuery } from "@/entities/recipe";

import {
  getCustomBackgroundErrorKind,
  useCreateCustomStickerBookBackground,
  useDeleteCustomStickerBookBackground,
  useUpdateStickerBookBackground,
} from "@/features/cooking-record-background";

export const useCookingRecordBackground = ({
  enabled,
  currentBackground,
  onApplied,
  onError,
  onCustomAdded,
  onCustomDeleted,
  onCustomDeleteError,
}: {
  enabled: boolean;
  currentBackground: StickerBookBackground | null;
  onApplied: () => void;
  onError: () => void;
  onCustomAdded: () => void;
  onCustomDeleted: () => void;
  onCustomDeleteError: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>();
  const [deleteRequest, setDeleteRequest] = useState<{
    backgroundKey: string;
    wasApplied: boolean;
  }>();
  const backgroundsQuery = useStickerBookBackgroundsQuery({
    enabled: enabled && isOpen,
  });
  const updateMutation = useUpdateStickerBookBackground();
  const createMutation = useCreateCustomStickerBookBackground();
  const deleteMutation = useDeleteCustomStickerBookBackground();
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
    createMutation.reset();
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

  const addCustomBackground = async (file: File) => {
    try {
      const background = await createMutation.createCustomBackground(file);
      setSelectedKey(background.backgroundKey);
      triggerHaptic("Success");
      onCustomAdded();
    } catch {
      triggerHaptic("Error");
    }
  };

  const retryCustomBackground = async () => {
    try {
      const background = await createMutation.retryRegistration();
      if (background === undefined) return;
      setSelectedKey(background.backgroundKey);
      triggerHaptic("Success");
      onCustomAdded();
    } catch {
      triggerHaptic("Error");
    }
  };

  const requestDeleteCustomBackground = () => {
    const selectedBackground = backgrounds.find(
      (background) => background.backgroundKey === selectedBackgroundKey
    );
    if (selectedBackground?.backgroundType !== "CUSTOM") return;
    setDeleteRequest({
      backgroundKey: selectedBackground.backgroundKey,
      wasApplied: selectedBackground.selected,
    });
  };

  const confirmDeleteCustomBackground = async () => {
    if (deleteRequest === undefined) return;
    try {
      await deleteMutation.mutateAsync(deleteRequest);
      setSelectedKey(undefined);
      setDeleteRequest(undefined);
      createMutation.reset();
      triggerHaptic("Success");
      onCustomDeleted();
    } catch (error) {
      if (isApiErrorWithCode(error, 404, 808)) {
        setSelectedKey(undefined);
        setDeleteRequest(undefined);
      }
      triggerHaptic("Error");
      onCustomDeleteError();
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
    addCustomBackground,
    retryCustomBackground,
    requestDeleteCustomBackground,
    confirmDeleteCustomBackground,
    onDeleteCustomBackgroundOpenChange: (open: boolean) => {
      if (!open && !deleteMutation.isPending) setDeleteRequest(undefined);
    },
    apply,
    isListPending: backgroundsQuery.isPending,
    isListError: backgroundsQuery.isError,
    retryList: backgroundsQuery.refetch,
    isApplying: updateMutation.isPending,
    isAddingCustom: createMutation.isPending,
    isDeleteCustomBackgroundOpen: deleteRequest !== undefined,
    isDeletingCustomBackground: deleteMutation.isPending,
    isCustomBackgroundProcessing: createMutation.isImageProcessing,
    customBackgroundErrorKind: getCustomBackgroundErrorKind(
      createMutation.error
    ),
  };
};
