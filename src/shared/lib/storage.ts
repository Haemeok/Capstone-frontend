type StorageKey = string;
type StorageValue = string | null;

type StorageItemWithExpiry<T> = {
  value: T;
  expiresAt: number;
};

class SafeStorage {
  private isAvailable(): boolean {
    try {
      return typeof window !== "undefined" && window.localStorage !== null;
    } catch {
      return false;
    }
  }

  getItem(key: StorageKey): StorageValue {
    if (!this.isAvailable()) return null;

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get localStorage item "${key}":`, error);
      return null;
    }
  }

  setItem(key: StorageKey, value: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set localStorage item "${key}":`, error);
      return false;
    }
  }

  removeItem(key: StorageKey): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove localStorage item "${key}":`, error);
      return false;
    }
  }

  getBooleanItem(key: StorageKey): boolean {
    return this.getItem(key) === "true";
  }

  setBooleanItem(key: StorageKey, value: boolean): boolean {
    return this.setItem(key, value.toString());
  }

  getItemWithExpiry<T>(key: StorageKey): T | null {
    const raw = this.getItem(key);
    if (!raw) return null;

    try {
      const parsed: StorageItemWithExpiry<T> = JSON.parse(raw);

      if (typeof parsed.expiresAt !== "number") {
        return null;
      }

      const now = Date.now();

      if (now >= parsed.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  }

  setItemWithExpiry<T>(key: StorageKey, value: T, ttlMs: number): boolean {
    const item: StorageItemWithExpiry<T> = {
      value,
      expiresAt: Date.now() + ttlMs,
    };
    return this.setItem(key, JSON.stringify(item));
  }
}

export const storage = new SafeStorage();
