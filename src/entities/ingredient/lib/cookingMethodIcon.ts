const COOKING_METHOD_ICON: Record<string, string> = {
  구이: "🔥",
  볶음: "🍳",
  찜: "🥘",
  조림: "🥘",
  끓이기: "🍲",
  국: "🍲",
  국물: "🍲",
  탕: "🍲",
  튀김: "🍤",
  부침: "🍳",
  무침: "🥗",
  샐러드: "🥗",
  생식: "🥗",
  회: "🍣",
  절임: "🥒",
  피클: "🥒",
  오븐: "♨️",
  디저트: "🍰",
  간식: "🍪",
};

export const getCookingMethodIcon = (method: string): string | null => {
  const trimmed = method.trim();
  if (!trimmed) return null;

  if (trimmed in COOKING_METHOD_ICON) {
    return COOKING_METHOD_ICON[trimmed];
  }

  for (const [keyword, icon] of Object.entries(COOKING_METHOD_ICON)) {
    if (trimmed.includes(keyword)) {
      return icon;
    }
  }

  return null;
};
