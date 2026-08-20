export type RecipeCookingRecordFormDraft = {
  recipeId: string;
  review: string;
  isPublic: boolean;
  imageFile?: File;
};

export type RecipeCookingRecordCopy = {
  close: string;
  rewardTitle: string;
  rewardKicker: string;
  rewardNext: string;
  formTitle: string;
  formDescription: string;
  photoLabel: string;
  photoOptional: string;
  defaultPhoto: string;
  addPhoto: string;
  reviewLabel: string;
  reviewPlaceholder: string;
  publishLabel: string;
  publishDescription: string;
  skip: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successDescription: string;
  successClose: string;
  error: string;
};

export type RecipeCookingRecordFlowProps = {
  isOpen: boolean;
  saveAmount: number;
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl: string;
  copy: RecipeCookingRecordCopy;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: RecipeCookingRecordFormDraft) => Promise<void>;
  onSkip: () => Promise<void>;
};
