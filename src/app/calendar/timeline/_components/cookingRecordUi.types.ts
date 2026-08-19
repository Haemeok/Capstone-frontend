export type CookingRecordStickerItem = {
  id: string;
  title: string;
  cookedAtLabel: string;
  imageUrl: string;
  imageAlt: string;
};

export type CookingRecordDetail = CookingRecordStickerItem & {
  review: string;
  recipeHref?: string;
};

export type CookingRecordEditValues = {
  title: string;
  review: string;
};

export type CookingRecordDetailCopy = {
  title: string;
  closeLabel: string;
  moreLabel: string;
  dishLabel: string;
  dishNameLabel: string;
  reviewLabel: string;
  titleRequiredError: string;
  titleTooLongError: string;
  reviewTooLongError: string;
  saveError: string;
  emptyReview: string;
  changePhoto: string;
  editRecord: string;
  saveRecord: string;
  viewRecipe: string;
  deleteRecord: string;
};

export type CookingRecordDetailDrawerProps = {
  isOpen: boolean;
  mode: "view" | "edit";
  detail: CookingRecordDetail;
  copy: CookingRecordDetailCopy;
  contentStatus: "ready" | "loading" | "error";
  loadingLabel: string;
  errorLabel: string;
  retryLabel: string;
  isReviewSaving: boolean;
  isPhotoReplacing: boolean;
  onOpenChange: (open: boolean) => void;
  onStartEdit: () => void;
  onSaveRecord: (values: CookingRecordEditValues) => Promise<boolean>;
  onPhotoChange: (file: File) => void;
  onDeleteRequest: () => void;
  onRetry: () => void;
};

export type CookingRecordViewSettingsCopy = {
  title: string;
  closeLabel: string;
  description: string;
  showRecordNamesLabel: string;
  showRecordNamesDescription: string;
  intro: string;
  previewLabel: string;
  optionsTitle: string;
  optionsLabel: string;
  optionLabel: string;
  loading: string;
  error: string;
  retry: string;
  apply: string;
  applying: string;
};
