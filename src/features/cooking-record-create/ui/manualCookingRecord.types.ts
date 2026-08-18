import type { UserPagesDict } from "@/shared/i18n";

export type ManualCookingRecordCopy =
  UserPagesDict["calendar"]["cookingRecord"]["create"];

export type ManualCookingRecordFormValues = {
  title: string;
  cookedDate: string;
  review: string;
  imageFile: File;
};

export type ManualCookingRecordDrawerProps = {
  isOpen: boolean;
  copy: ManualCookingRecordCopy;
  onOpenChange: (open: boolean) => void;
};
