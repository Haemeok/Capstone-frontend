"use client";

import type { UserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import type { RecordSourceType } from "@/entities/recipe";

import { useDeleteCookingRecord } from "@/features/cooking-record-delete";
import {
  useReplaceCookingRecordImage,
  useUpdateCookingRecordMetadata,
} from "@/features/cooking-record-edit";

import type { CookingRecordEditValues } from "./cookingRecordUi.types";

type UseCookingRecordActionsParams = {
  recordId: string;
  sourceType: RecordSourceType;
  copy: UserPagesDict["calendar"]["cookingRecord"]["toast"];
  onMetadataSaved: (values: CookingRecordEditValues) => void;
  onDeleted: () => void;
};

export const useCookingRecordActions = ({
  recordId,
  sourceType,
  copy,
  onMetadataSaved,
  onDeleted,
}: UseCookingRecordActionsParams) => {
  const addToast = useToastStore((state) => state.addToast);
  const metadataMutation = useUpdateCookingRecordMetadata();
  const imageMutation = useReplaceCookingRecordImage();
  const deleteMutation = useDeleteCookingRecord();

  const saveMetadata = async ({ title, review }: CookingRecordEditValues) => {
    try {
      await metadataMutation.mutateAsync({
        recordId,
        sourceType,
        recordTitle: title,
        recordMemo: review,
      });
      onMetadataSaved({ title, review });
      notify("Success", copy.reviewSaved, "success");
      return true;
    } catch {
      notify("Error", copy.reviewSaveFailed, "error");
      return false;
    }
  };

  const changePhoto = async (file: File) => {
    try {
      await imageMutation.replaceImage({
        recordId,
        images: [{ file, purpose: "ORIGINAL" }],
      });
      notify("Success", copy.photoChanged, "success");
    } catch {
      notify("Error", copy.photoChangeFailed, "error");
    }
  };

  const deleteRecord = async (snapshotRecordId: string) => {
    try {
      await deleteMutation.mutateAsync(snapshotRecordId);
      notify("Success", copy.recordDeleted, "success");
      onDeleted();
    } catch {
      notify("Error", copy.recordDeleteFailed, "error");
    }
  };

  const notify = (
    haptic: "Success" | "Error",
    message: string,
    variant: "success" | "error"
  ) => {
    triggerHaptic(haptic);
    addToast({ message, variant });
  };

  return {
    saveMetadata,
    changePhoto,
    deleteRecord,
    isReviewSaving: metadataMutation.isPending,
    isPhotoReplacing: imageMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
