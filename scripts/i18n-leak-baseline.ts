import { writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  collectDisplayLeaks,
  leakFiles,
} from "../src/shared/i18n/testing/leakScanConfig";

const root = join(process.cwd(), "src");
const violations = collectDisplayLeaks(root);
const files = leakFiles(violations);

const dest = join(
  process.cwd(),
  "src/shared/i18n/testing/i18n-leak-allowlist.json"
);
writeFileSync(dest, `${JSON.stringify(files, null, 2)}\n`);

console.log(
  `allowlist: ${files.length} files, ${violations.length} violations`
);
for (const f of files) {
  const n = violations.filter((v) => v.file === f).length;
  console.log(`  ${n}\t${f}`);
}
