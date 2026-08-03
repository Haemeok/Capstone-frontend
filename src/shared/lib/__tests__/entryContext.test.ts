const loadDocument = async (entryPath: string) => {
  window.history.replaceState({}, "", entryPath);
  jest.resetModules();
  return import("../entryContext");
};

describe("entryContext", () => {
  it("문서가 로드된 경로를 진입 경로로 잡는다", async () => {
    const { isEntryPath } = await loadDocument("/recipes/A");

    expect(isEntryPath("/recipes/A")).toBe(true);
    expect(isEntryPath("/recipes/B")).toBe(false);
  });

  it("진입 경로와 다른 경로로 이동하면 내부 이동으로 표시한다", async () => {
    const { hasInternalNav, markInternalNav } =
      await loadDocument("/recipes/A");

    markInternalNav("/recipes/A");
    expect(hasInternalNav()).toBe(false);

    markInternalNav("/recipes/B");
    expect(hasInternalNav()).toBe(true);
  });

  it("새 문서로 진입하면 이전 문서의 내부 이동 기록이 남지 않는다", async () => {
    const first = await loadDocument("/recipes/A");
    first.markInternalNav("/recipes/B");
    expect(first.hasInternalNav()).toBe(true);

    const second = await loadDocument("/recipes/C");

    expect(second.hasInternalNav()).toBe(false);
    expect(second.isEntryPath("/recipes/C")).toBe(true);
  });
});
