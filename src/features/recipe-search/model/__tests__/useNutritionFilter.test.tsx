import { act, renderHook } from "@testing-library/react";

import { createDefaultNutritionValues } from "@/shared/lib/nutrition/utils";

import { useNutritionFilter } from "../useNutritionFilter";

const DEFAULTS = createDefaultNutritionValues();

describe("useNutritionFilter 국가 draft", () => {
  it("유튜브 유형을 해제하면 국가 선택이 비워진다", () => {
    const initialTypes = ["YOUTUBE"];
    const initialCountries = ["일본"];
    const { result } = renderHook(() =>
      useNutritionFilter(true, DEFAULTS, initialTypes, initialCountries)
    );
    expect(result.current.countries).toEqual(["일본"]);

    act(() => {
      result.current.handleTypesChange(["USER"]);
    });
    expect(result.current.countries).toEqual([]);
  });

  it("유튜브가 선택된 동안 국가 선택을 변경할 수 있다", () => {
    const initialTypes = ["YOUTUBE"];
    const initialCountries: string[] = [];
    const { result } = renderHook(() =>
      useNutritionFilter(true, DEFAULTS, initialTypes, initialCountries)
    );

    act(() => {
      result.current.handleCountriesChange(["기타"]);
    });
    expect(result.current.countries).toEqual(["기타"]);
  });
});
