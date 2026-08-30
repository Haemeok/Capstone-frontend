const STORAGE_KEY = "recipe-step-font-size";

const clearFallbackCookie = () => {
  document.cookie = `${STORAGE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
};

describe("useStepFontSizeStore WebView storage", () => {
  const localStorageDescriptor = Object.getOwnPropertyDescriptor(
    window,
    "localStorage"
  );

  beforeEach(() => {
    jest.resetModules();
    clearFallbackCookie();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: null,
    });
  });

  afterEach(() => {
    clearFallbackCookie();
    if (localStorageDescriptor) {
      Object.defineProperty(window, "localStorage", localStorageDescriptor);
    }
  });

  it("T-FONT-01: localStorage가 없는 WebView에서도 글자 크기를 저장하고 다시 불러옵니다", async () => {
    const firstModule = await import("../useStepFontSizeStore");

    expect(() =>
      firstModule.useStepFontSizeStore.getState().cycle()
    ).not.toThrow();
    expect(firstModule.useStepFontSizeStore.getState().level).toBe(1);

    jest.resetModules();
    const reloadedModule = await import("../useStepFontSizeStore");
    await reloadedModule.useStepFontSizeStore.persist.rehydrate();

    expect(reloadedModule.useStepFontSizeStore.getState().level).toBe(1);
  });

  it("T-FONT-02: 모든 브라우저 저장소가 막혀도 글자 크기 변경은 동작합니다", async () => {
    const cookieDescriptor = Object.getOwnPropertyDescriptor(
      document,
      "cookie"
    );
    Object.defineProperty(document, "cookie", {
      configurable: true,
      get: () => {
        throw new DOMException("Cookie access denied", "SecurityError");
      },
      set: () => {
        throw new DOMException("Cookie access denied", "SecurityError");
      },
    });

    try {
      const storeModule = await import("../useStepFontSizeStore");

      expect(() =>
        storeModule.useStepFontSizeStore.getState().cycle()
      ).not.toThrow();
      expect(storeModule.useStepFontSizeStore.getState().level).toBe(1);
    } finally {
      if (cookieDescriptor) {
        Object.defineProperty(document, "cookie", cookieDescriptor);
      } else {
        Reflect.deleteProperty(document, "cookie");
      }
    }
  });
});
