type StorageKey = string;
type StorageValue = string | null;

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
}

export const storage = new SafeStorage();
