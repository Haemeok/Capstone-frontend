import { MODELS } from "./models";

const STORAGE_KEY = "admin-image-test.enabled-models";

export const loadEnabledModels = (): string[] => {
  if (typeof window === "undefined") return MODELS.map((m) => m.id);
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return MODELS.map((m) => m.id);
  try {
    const ids = JSON.parse(raw) as string[];
    const known = new Set(MODELS.map((m) => m.id));
    return ids.filter((id) => known.has(id));
  } catch {
    return MODELS.map((m) => m.id);
  }
};

export const saveEnabledModels = (ids: string[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};
