import type { ComponentType } from "react";

import type { UserPagesDict } from "@/shared/i18n";

import type {
  RecordPhotoDraft,
  RecordPhotoEditorProps,
} from "@/entities/recipe/model/recordPhoto.types";

export type ManualCookingRecordCopy =
  UserPagesDict["calendar"]["cookingRecord"]["create"];

export type ManualCookingRecordFormValues = {
  title: string;
  cookedDate: string;
  review: string;
  imageFile: File;
  photo?: RecordPhotoDraft;
};

export type ManualCookingRecordDrawerProps = {
  isOpen: boolean;
  initialCookedDate?: string;
  copy: ManualCookingRecordCopy;
  photoEditor?: ComponentType<RecordPhotoEditorProps>;
  onOpenChange: (open: boolean) => void;
};
