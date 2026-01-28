import {
  DISH_TYPE_CODES,
  SORT_TYPE_CODES,
  TAG_DEFINITIONS,
  TAGS_BY_CODE,
} from "@/shared/config/constants/recipe";

export const dishTypeCodec = {
  encode: (value: string): string | null => {
    return DISH_TYPE_CODES[value as keyof typeof DISH_TYPE_CODES] || null;
  },
  decode: (code: string | null): string => {
    if (!code) return "전체";
    const key = Object.keys(DISH_TYPE_CODES).find(
      (k) => DISH_TYPE_CODES[k as keyof typeof DISH_TYPE_CODES] === code
    );
    return key || "전체";
  },
};

export const sortCodec = {
  encode: (value: string): string | null => {
    return SORT_TYPE_CODES[value as keyof typeof SORT_TYPE_CODES] || null;
  },
  decode: (code: string | null): string => {
    if (!code) return "최신순";
    const key = Object.keys(SORT_TYPE_CODES).find(
      (k) => SORT_TYPE_CODES[k as keyof typeof SORT_TYPE_CODES] === code
    );
    return key || "최신순";
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
