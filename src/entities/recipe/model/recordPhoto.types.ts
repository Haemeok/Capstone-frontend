import type { ImageSize, PhotoCrop } from "@/shared/lib/image-crop";

export type RecordMaskShape =
  | "CIRCLE"
  | "ROUNDED_DIAMOND"
  | "ROUNDED_HEXAGON"
  | "ROUNDED_OCTAGON"
  | "WAVY_CIRCLE_5"
  | "WAVY_CIRCLE_6"
  | "WAVY_CIRCLE_8"
  | "WAVY_CIRCLE_10";
export type RecordPhotoShape =
  | { kind: "sticker" }
  | { kind: "mask"; value: RecordMaskShape };
export type RecordPlateCategory =
  | "plain"
  | "pattern"
  | "botanical"
  | "material"
  | "other";
export type RecordPlate = {
  plateId: string;
  name: string;
  imageUrl: string;
  category: RecordPlateCategory;
};
export type RecordPhotoCatalog = {
  plates: RecordPlate[];
  maskShapes: { value: RecordMaskShape; label: string }[];
};
export type RecordPhotoCatalogState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; catalog: RecordPhotoCatalog };
export type RecordPhotoDraft = {
  originalFile: File | null;
  originalUrl: string | null;
  stickerUrl: string | null;
  stickerImageSize?: ImageSize;
  preparedImage?: { originalKey: string; stickerKey: string };
  imageSize: ImageSize;
  shape: RecordPhotoShape;
  plateId: string | null;
  crop: PhotoCrop;
};
export type RecordPhotoView = {
  photo: RecordPhotoDraft;
  plate: RecordPlate | null;
};

export type RecordPhotoEditorProps = {
  fallbackImageUrl?: string;
  fallbackImageAlt?: string;
  requireUpload?: boolean;
  value: RecordPhotoDraft;
  onChange: (photo: RecordPhotoDraft) => void;
  disabled?: boolean;
  error?: string;
  onBusyChange?: (busy: boolean) => void;
};
export type RecordDisplayStyle = {
  plateId?: string | null;
  maskShape?: RecordMaskShape | null;
  crop?: PhotoCrop | null;
};
export type RecordDisplayInput = {
  displayMode?: "DISH" | "STICKER";
  displayStyle?: RecordDisplayStyle | null;
};
export type RecordDisplayResponse = {
  displayMode?: "DISH" | "STICKER" | null;
  croppedImageUrl?: string | null;
  displayStyle?:
    | (RecordDisplayStyle & { plateImageUrl?: string | null })
    | null;
};
