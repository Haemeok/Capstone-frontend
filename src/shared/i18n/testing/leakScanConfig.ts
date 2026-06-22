import { readFileSync } from "node:fs";

import type { Violation } from "./staticScan";
import { collectSourceFiles, findKoreanDisplayLeaks } from "./staticScan";

export const KO_ONLY_DIRS = [
  "src/shared/config",
  "src/shared/lib",
  "src/shared/api",
  "src/shared/hooks",
  "src/app/admin",
  "src/app/recipes/admin",
  "src/app/api",
  "src/app/actions",
  "src/app/feed",
  "src/app/notice",
  "src/app/privacy",
  "src/app/magazine",
  "src/app/archetype",
  "src/app/curation",
  "src/app/calendar/[date]/components",
  "src/features/archetype",
  "src/features/curation",
  "src/features/recipe-chat",
  "src/features/level-up",
  "src/features/user-survey",
  "src/entities/curation",
  "src/widgets/BridgeTest",
  "src/widgets/NotificationTest",
  "src/widgets/ToastDebugPanel",
  "src/widgets/CurationList",
  "src/widgets/MonthlySavingsSummary",
  "src/widgets/SlideShowContent",
  "src/widgets/FineDiningRecipe",
  "src/widgets/BudgetRecipe",
];

const toRel = (full: string, root: string): string =>
  full.replace(/\\/g, "/").replace(root.replace(/\\/g, "/"), "src");

export const collectDisplayLeaks = (root: string): Violation[] => {
  const out: Violation[] = [];
  for (const full of collectSourceFiles(root)) {
    const rel = toRel(full, root);
    if (KO_ONLY_DIRS.some((dir) => rel.startsWith(dir))) continue;
    for (const v of findKoreanDisplayLeaks(readFileSync(full, "utf8"), rel)) {
      out.push(v);
    }
  }
  return out;
};

export const leakFiles = (violations: Violation[]): string[] =>
  [...new Set(violations.map((v) => v.file))].sort();
