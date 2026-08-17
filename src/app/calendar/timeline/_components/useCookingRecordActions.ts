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

type UseCookingRecordActionsParams = {
  recordId: string;
  sourceType: RecordSourceType;
  copy: UserPagesDict["calendar"]["cookingRecord"]["toast"];
  onReviewSaved: (review: string) => void;
  onDeleted: () => void;
};

export const useCookingRecordActions = ({
  recordId,
  sourceType,
  copy,
  onReviewSaved,
  onDeleted,
}: UseCookingRecordActionsParams) => {
  const addToast = useToastStore((state) => state.addToast);
  const metadataMutation = useUpdateCookingRecordMetadata();
  const imageMutation = useReplaceCookingRecordImage();
  const deleteMutation = useDeleteCookingRecord();

  const saveReview = async (recordMemo: string) => {
    try {
      await metadataMutation.mutateAsync({ recordId, sourceType, recordMemo });
      onReviewSaved(recordMemo);
      notify("Success", copy.reviewSaved, "success");
    } catch {
      notify("Error", copy.reviewSaveFailed, "error");
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
    saveReview,
    changePhoto,
    deleteRecord,
    isReviewSaving: metadataMutation.isPending,
    isPhotoReplacing: imageMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
