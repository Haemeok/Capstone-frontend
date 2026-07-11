import type { CartItem } from "../api/types";

export type CartItemNameGroup = {
  name: string;
  items: CartItem[];
  totalAmount: string | null;
};

const parseQuantity = (quantity: string): number | null => {
  const trimmed = quantity.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

// 수량은 자유 텍스트("약간", "1/2")라 전 항목이 숫자 + 동일 단위일 때만 합산
const sumAmounts = (items: CartItem[]): string | null => {
  if (items.length < 2) return null;
  const unit = items[0].unit.trim();
  if (unit === "") return null;

  let total = 0;
  for (const item of items) {
    const parsed = parseQuantity(item.quantity);
    if (parsed === null || item.unit.trim() !== unit) return null;
    total += parsed;
  }
  return `${Number(total.toFixed(2))}${unit}`;
};

export const groupCartItemsByName = (
  items: CartItem[]
): CartItemNameGroup[] => {
  const groups = new Map<string, CartItem[]>();
  for (const item of items) {
    const existing = groups.get(item.name);
    if (existing) existing.push(item);
    else groups.set(item.name, [item]);
  }
  return [...groups.entries()].map(([name, grouped]) => ({
    name,
    items: grouped,
    totalAmount: sumAmounts(grouped),
  }));
};
