import { storage } from "../storage";

describe("SafeStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("setItemWithExpiry / getItemWithExpiry", () => {
    it("만료 전에는 값을 정상적으로 반환해야 함", () => {
      const key = "test-expiry";
      const value = { foo: "bar" };
      const ttlMs = 10000; // 10초

      storage.setItemWithExpiry(key, value, ttlMs);

      const result = storage.getItemWithExpiry<typeof value>(key);
      expect(result).toEqual(value);
    });

    it("만료 후에는 null을 반환하고 항목을 삭제해야 함", () => {
      const key = "test-expiry-expired";
      const value = true;
      const ttlMs = 1000; // 1초

      storage.setItemWithExpiry(key, value, ttlMs);

      // 1초 지남
      jest.advanceTimersByTime(1001);

      const result = storage.getItemWithExpiry<boolean>(key);
      expect(result).toBeNull();
      expect(localStorage.getItem(key)).toBeNull();
    });

    it("TTL이 0이면 즉시 만료되어야 함", () => {
      const key = "test-zero-ttl";
      const value = "test";

      storage.setItemWithExpiry(key, value, 0);

      jest.advanceTimersByTime(1);

      const result = storage.getItemWithExpiry<string>(key);
      expect(result).toBeNull();
    });

    it("복잡한 객체도 저장하고 복원할 수 있어야 함", () => {
      const key = "test-complex";
      const value = {
        nested: { deeply: { value: 123 } },
        array: [1, 2, 3],
        string: "hello",
      };
      const ttlMs = 60000;

      storage.setItemWithExpiry(key, value, ttlMs);

      const result = storage.getItemWithExpiry<typeof value>(key);
      expect(result).toEqual(value);
    });

    it("boolean 값도 저장하고 복원할 수 있어야 함", () => {
      const key = "test-boolean";
      const value = true;
      const ttlMs = 60000;

      storage.setItemWithExpiry(key, value, ttlMs);

      const result = storage.getItemWithExpiry<boolean>(key);
      expect(result).toBe(true);
    });

    it("존재하지 않는 키는 null을 반환해야 함", () => {
      const result = storage.getItemWithExpiry<string>("non-existent-key");
      expect(result).toBeNull();
    });

    it("잘못된 JSON 형식이 저장되어 있으면 null을 반환해야 함", () => {
      const key = "test-invalid-json";
      localStorage.setItem(key, "not-valid-json");

      const result = storage.getItemWithExpiry<string>(key);
      expect(result).toBeNull();
    });

    it("expiresAt 필드가 없는 객체가 저장되어 있으면 null을 반환해야 함", () => {
      const key = "test-no-expiry";
      localStorage.setItem(key, JSON.stringify({ value: "test" }));

      const result = storage.getItemWithExpiry<string>(key);
      expect(result).toBeNull();
    });
  });

  describe("기존 메서드들과의 호환성", () => {
    it("getItem과 setItem은 기존대로 작동해야 함", () => {
      const key = "test-basic";
      const value = "basic-value";

      storage.setItem(key, value);
      expect(storage.getItem(key)).toBe(value);
    });

    it("getBooleanItem과 setBooleanItem은 기존대로 작동해야 함", () => {
      const key = "test-boolean-basic";

      storage.setBooleanItem(key, true);
      expect(storage.getBooleanItem(key)).toBe(true);

      storage.setBooleanItem(key, false);
      expect(storage.getBooleanItem(key)).toBe(false);
    });
  });
});
