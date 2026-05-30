import { act, renderHook } from "@testing-library/react";

import type { IngredientItem } from "@/entities/ingredient";

import { useIngredientSelection } from "../useIngredientSelection";

const make = (id: string, name = id): IngredientItem => ({
  id,
  name,
  unit: "개",
  inFridge: false,
  calories: 0,
});

describe("useIngredientSelection", () => {
  it("toggles an ingredient in and back out", () => {
    const { result } = renderHook(() => useIngredientSelection());
    const carrot = make("1", "당근");

    act(() => result.current.toggle(carrot));
    expect(result.current.isSelected("1")).toBe(true);
    expect(result.current.count).toBe(1);
    expect(result.current.selectedItems).toEqual([carrot]);

    act(() => result.current.toggle(carrot));
    expect(result.current.isSelected("1")).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it("removes by id and clears all", () => {
    const { result } = renderHook(() => useIngredientSelection());

    act(() => {
      result.current.toggle(make("1"));
      result.current.toggle(make("2"));
    });
    expect(result.current.count).toBe(2);

    act(() => result.current.remove("1"));
    expect(result.current.isSelected("1")).toBe(false);
    expect(result.current.count).toBe(1);

    act(() => result.current.clear());
    expect(result.current.count).toBe(0);
  });
});
