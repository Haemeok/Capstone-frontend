import { createHash } from "crypto";

import type { CurationParams } from "@/entities/curation";

export const slugify = (params: CurationParams): string => {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${encodeURIComponent(String(params[k]))}`)
    .join("&");
  return createHash("sha1").update(sorted).digest("hex").slice(0, 12);
};
