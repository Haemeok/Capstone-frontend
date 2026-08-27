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
  initialCookedDate?: string;
  copy: ManualCookingRecordCopy;
  onOpenChange: (open: boolean) => void;
};
