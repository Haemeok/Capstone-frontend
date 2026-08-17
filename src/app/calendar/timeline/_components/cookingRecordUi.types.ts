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

export type CookingRecordBackgroundPreset = "dot" | "linen" | "tile" | "wood";

export type CookingRecordBackground =
  | { kind: CookingRecordBackgroundPreset }
  | { kind: "custom"; imageUrl: string };

export type CookingRecordDetailCopy = {
  title: string;
  closeLabel: string;
  moreLabel: string;
  dishLabel: string;
  reviewLabel: string;
  emptyReview: string;
  changePhoto: string;
  editReview: string;
  saveReview: string;
  viewRecipe: string;
  deleteRecord: string;
};

export type CookingRecordBackgroundCopy = {
  title: string;
  closeLabel: string;
  monthOnlyLabel: string;
  intro: string;
  previewLabel: string;
  optionsTitle: string;
  optionsLabel: string;
  optionLabels: Record<CookingRecordBackgroundPreset, string>;
  customBackground: string;
  apply: string;
};
