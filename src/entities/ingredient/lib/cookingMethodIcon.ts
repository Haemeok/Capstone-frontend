import {
  Cake,
  ChefHat,
  Cookie,
  Drumstick,
  Fish,
  Flame,
  type LucideIcon,
  Salad,
  Soup,
  Utensils,
} from "lucide-react";

const COOKING_METHOD_ICON: Record<string, LucideIcon> = {
  구이: Flame,
  볶음: ChefHat,
  찜: Soup,
  조림: Soup,
  끓이기: Soup,
  국: Soup,
  국물: Soup,
  탕: Soup,
  튀김: Drumstick,
  부침: ChefHat,
  무침: Salad,
  샐러드: Salad,
  생식: Salad,
  회: Fish,
  절임: Utensils,
  피클: Utensils,
  오븐: Flame,
  디저트: Cake,
  간식: Cookie,
};

export const getCookingMethodIcon = (method: string): LucideIcon | null => {
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
