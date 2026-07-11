// i18n-ignore-file: 장바구니는 ko 전용 (스펙 2026-07-11-cart-design.md)
export const CART_MESSAGES = {
  added: "장바구니에 담았어요",
  alreadyInCart: "이미 담긴 재료예요",
  limitExceeded: "장바구니가 가득 찼어요",
  addFailed: "담기에 실패했어요. 잠시 후 다시 시도해 주세요",
  updateFailed: "수정에 실패했어요",
  deleteFailed: "삭제에 실패했어요",
  migrated: (count: number) => `장바구니 ${count}개를 계정으로 옮겼어요`,
} as const;
