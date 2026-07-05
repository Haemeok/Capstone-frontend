import {
  COUNTRY_DEFINITIONS,
  DISH_TYPE_CODES,
  type DishType,
  SORT_TYPE_CODES,
  type SortType,
  TAG_DEFINITIONS,
  TAGS_BY_CODE,
} from "@/shared/config/constants/recipe";
import { getTypedKeys } from "@/shared/lib/types/utils";

export const dishTypeCodec = {
  encode: (value: DishType): string | null => {
    return DISH_TYPE_CODES[value] || null;
  },
  decode: (code: string | null): DishType => {
    if (!code) return "전체";
    const key = getTypedKeys(DISH_TYPE_CODES).find(
      (k) => DISH_TYPE_CODES[k] === code
    );
    return key ?? "전체";
  },
};

export const sortCodec = {
  encode: (value: SortType): string | null => {
    return SORT_TYPE_CODES[value] || null;
  },
  decode: (code: string | null): SortType => {
    if (!code) return "인기순";
    const key = getTypedKeys(SORT_TYPE_CODES).find(
      (k) => SORT_TYPE_CODES[k] === code
    );
    return key ?? "인기순";
  },
};

export const tagsCodec = {
  encode: (values: string[]): string | null => {
    if (values.length === 0) return null;
    const codes = values.map((tag) => {
      const matched = TAG_DEFINITIONS.find(
        (def) => tag === `${def.emoji} ${def.name}` || tag === def.name
      );
      return matched ? matched.code : tag;
    });
    return codes.join(",");
  },
  decode: (param: string | null): string[] => {
    if (!param) return [];
    return param
      .split(",")
      .filter(Boolean)
      .map((code) => {
        const tag = TAGS_BY_CODE[code as keyof typeof TAGS_BY_CODE];
        return tag ? `${tag.emoji} ${tag.name}` : code;
      });
  },
};

export const queryCodec = {
  encode: (value: string): string | null => {
    return value.trim() || null;
  },
  decode: (param: string | null): string => {
    return param || "";
  },
};

export const ingredientsCodec = {
  encode: (values: string[]): string | null => {
    if (values.length === 0) return null;
    return values.join(",");
  },
  decode: (param: string | null): string[] => {
    if (!param) return [];
    return param.split(",").filter(Boolean);
  },
};

export const countryCodec = {
  encode: (values: string[]): string | null => {
    if (values.length === 0) return null;
    const codes = values.map((label) => {
      const matched = COUNTRY_DEFINITIONS.find((def) => def.label === label);
      return matched ? matched.code : label;
    });
    return codes.join(",");
  },
  decode: (param: string | null): string[] => {
    if (!param) return [];
    return param
      .split(",")
      .filter(Boolean)
      .map((code) => {
        const matched = COUNTRY_DEFINITIONS.find((def) => def.code === code);
        return matched ? matched.label : code;
      });
  },
};
