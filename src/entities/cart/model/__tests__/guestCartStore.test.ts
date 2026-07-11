import { GUEST_CART_STORAGE_KEY } from "../guestCartPersistence";
import { type GuestCartItem, useGuestCartStore } from "../guestCartStore";

const item = (recipeIngredientId: string): GuestCartItem => ({
  recipeIngredientId,
  name: "배추김치",
  quantity: "100",
  unit: "g",
  recipe: { recipeId: "r7KpQ2mA", title: "김치찌개", imageUrl: null },
});

beforeEach(() => {
  window.localStorage.clear();
  useGuestCartStore.setState({ items: [], isHydrated: true });
});

describe("guestCartStore", () => {
  it("T-27: 추가·중복 skip·200개 캡", () => {
    const first = useGuestCartStore
      .getState()
      .addItems([item("ri1"), item("ri2")]);
    expect(first).toEqual({ addedCount: 2, skippedCount: 0 });

    const dup = useGuestCartStore.getState().addItems([item("ri1")]);
    expect(dup).toEqual({ addedCount: 0, skippedCount: 1 });
    expect(useGuestCartStore.getState().items).toHaveLength(2);

    const bulk = Array.from({ length: 198 }, (_, i) => item(`ri-bulk-${i}`));
    useGuestCartStore.getState().addItems(bulk);
    expect(useGuestCartStore.getState().items).toHaveLength(200);
    const overflow = useGuestCartStore.getState().addItems([item("ri-over")]);
    expect(overflow).toEqual({ addedCount: 0, skippedCount: 1 });
    expect(useGuestCartStore.getState().items).toHaveLength(200);
  });

  it("T-27: 최신 담은 항목이 앞에 온다 (서버 정렬과 동일)", () => {
    useGuestCartStore.getState().addItems([item("ri1")]);
    useGuestCartStore.getState().addItems([item("ri2")]);
    expect(
      useGuestCartStore.getState().items.map((i) => i.recipeIngredientId)
    ).toEqual(["ri2", "ri1"]);
  });

  it("T-34: addItems가 localStorage에 기록한다 (새로고침 유지 근거)", () => {
    useGuestCartStore.getState().addItems([item("ri1")]);
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    expect(raw).toContain("ri1");
  });

  it("updateItem은 빈 값이면 기존 값을 유지하고 localStorage에 반영한다", () => {
    useGuestCartStore.getState().addItems([item("ri1")]);
    useGuestCartStore
      .getState()
      .updateItem("ri1", { quantity: "300", unit: "" });
    const updated = useGuestCartStore.getState().items[0];
    expect(updated.quantity).toBe("300");
    expect(updated.unit).toBe("g");
    expect(window.localStorage.getItem(GUEST_CART_STORAGE_KEY)).toContain(
      "300"
    );
  });

  it("removeItems가 지정 항목만 지운다", () => {
    useGuestCartStore
      .getState()
      .addItems([item("ri1"), item("ri2"), item("ri3")]);
    useGuestCartStore.getState().removeItems(["ri1", "ri3"]);
    expect(
      useGuestCartStore.getState().items.map((i) => i.recipeIngredientId)
    ).toEqual(["ri2"]);
  });

  it("clear가 store와 localStorage를 모두 비운다", () => {
    useGuestCartStore.getState().addItems([item("ri1")]);
    useGuestCartStore.getState().clear();
    expect(useGuestCartStore.getState().items).toEqual([]);
    expect(window.localStorage.getItem(GUEST_CART_STORAGE_KEY)).toBeNull();
  });

  it("hydrateFromStorage가 저장 항목을 복원하고 isHydrated를 켠다", () => {
    useGuestCartStore.getState().addItems([item("ri1")]);
    useGuestCartStore.setState({ items: [], isHydrated: false });

    useGuestCartStore.getState().hydrateFromStorage();

    expect(useGuestCartStore.getState().items).toHaveLength(1);
    expect(useGuestCartStore.getState().isHydrated).toBe(true);
  });

  it("hydrateFromStorage는 깨진 JSON에도 빈 배열로 복구한다", () => {
    window.localStorage.setItem(GUEST_CART_STORAGE_KEY, "{broken");
    useGuestCartStore.setState({ items: [], isHydrated: false });
    useGuestCartStore.getState().hydrateFromStorage();
    expect(useGuestCartStore.getState().items).toEqual([]);
    expect(useGuestCartStore.getState().isHydrated).toBe(true);
  });
});
