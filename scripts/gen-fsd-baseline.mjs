import { execSync } from "node:child_process";
import fs from "node:fs";

let out;
try {
  out = execSync("npx eslint . -f json", { maxBuffer: 1 << 30 }).toString();
} catch (e) {
  out = e.stdout?.toString() ?? "";
}

const report = JSON.parse(out);
const files = new Set();
for (const file of report) {
  for (const msg of file.messages) {
    if (msg.ruleId !== "local/fsd-import") continue;
    const rel = file.filePath.replace(/\\/g, "/").split("/src/")[1];
    if (rel) files.add("src/" + rel);
  }
}

const sorted = [...files].sort();
fs.writeFileSync(
  "eslint-fsd-baseline.json",
  JSON.stringify(sorted, null, 2) + "\n"
);
console.log(`fsd baseline: ${sorted.length} files`);
