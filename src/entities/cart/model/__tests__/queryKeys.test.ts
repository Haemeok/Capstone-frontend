import { CART_QUERY_KEYS } from "../queryKeys";

it("언어가 다르면 장바구니 query key가 달라 캐시가 분리된다 (T-12)", () => {
  expect(CART_QUERY_KEYS.byLang("ko")).not.toEqual(
    CART_QUERY_KEYS.byLang("ja")
  );
});

it("byLang key는 all을 prefix로 가져 무효화가 전 언어에 미친다", () => {
  expect(CART_QUERY_KEYS.byLang("ko").slice(0, 1)).toEqual([
    ...CART_QUERY_KEYS.all,
  ]);
});
