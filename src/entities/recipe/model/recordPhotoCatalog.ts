import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  RecordPhotoCatalog,
  RecordPlateCategory,
} from "./recordPhoto.types";

const plateCategories: Record<string, RecordPlateCategory> = {
  Z6edXexm: "botanical",
  YWwYkeoE: "pattern",
  "60J3OJMY": "material",
  vKBp7wN8: "material",
  X1BoaJNZ: "pattern",
  jzw5yw46: "botanical",
  mKe60w9X: "pattern",
  N8eA4Bqb: "botanical",
  RlBgYJZG: "plain",
  ArBNmwkp: "pattern",
  qjeZNepm: "botanical",
  rPem9eGA: "plain",
  GzBk3Bml: "pattern",
  RMBb6B5K: "pattern",
  "3zejAB4l": "botanical",
  RyJV6Jd2: "material",
};

type CatalogResponse = {
  plates: { plateId: string; name: string; imageUrl: string }[];
  maskShapes: RecordPhotoCatalog["maskShapes"];
};
export const getRecordPhotoCatalog = async (): Promise<RecordPhotoCatalog> => {
  const result = await api.get<CatalogResponse>(END_POINTS.STICKER_BOOK_PLATES);
  return {
    plates: result.plates.map((plate) => ({
      ...plate,
      category: plateCategories[plate.plateId] ?? "other",
    })),
    maskShapes: result.maskShapes,
  };
};
