import * as path from "path";

export const API_BASE = "https://api.recipio.kr/api/recipes/search";
export const CONCURRENCY = 20;
export const DELAY_MS = 100;
export const MAX_RETRIES = 3;
export const RETRY_BACKOFF = [1000, 3000, 10000];
export const TIMEOUT_MS = 10000;
export const MIN_RESULTS = 8;
export const MAX_ERROR_RATE = 0.1;

export const DATA_DIR = path.resolve(process.cwd(), "data");
export const ALLOWLIST_PATH = path.resolve(
  process.cwd(),
  "src/shared/config/seo/sitemap-allowlist.json"
);
export const ARCHIVE_PATH = path.join(DATA_DIR, "seo-archive.json");
export const SEEN_PATH = path.join(DATA_DIR, "seo-seen.json");
export const INGREDIENTS_JSON_PATH = path.resolve(
  process.cwd(),
  "src/shared/config/seo/ingredients.json"
);

export const today = () => new Date().toISOString().split("T")[0];
