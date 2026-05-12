// Find self-barrel imports: a file at src/<layer>/<slice>/... that imports
// from "@/<layer>/<slice>" (its own slice's barrel).
// Run: node scripts/find-self-barrel.mjs

import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("src");
const LAYERS = ["entities", "features", "widgets"];
const hits = [];

const walk = (dir, cb) => {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walk(p, cb);
    else if (/\.(ts|tsx)$/.test(d.name) && !p.includes("__tests__") && !/\.test\.tsx?$/.test(d.name)) {
      cb(p);
    }
  }
};

for (const layer of LAYERS) {
  const layerDir = path.join(SRC, layer);
  if (!fs.existsSync(layerDir)) continue;
  for (const sliceEntry of fs.readdirSync(layerDir, { withFileTypes: true })) {
    if (!sliceEntry.isDirectory()) continue;
    const slice = sliceEntry.name;
    const sliceDir = path.join(layerDir, slice);
    const barrel = `@/${layer}/${slice}`;
    // Match: from "@/<layer>/<slice>"  — exact, not followed by "/"
    const re = new RegExp(
      String.raw`from\s+["']` +
        barrel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        String.raw`["']`,
      "g",
    );
    walk(sliceDir, (file) => {
      const src = fs.readFileSync(file, "utf8");
      const lines = src.split(/\r?\n/);
      const matched = [];
      for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) {
          matched.push({ lineNo: i + 1, text: lines[i].trim() });
          re.lastIndex = 0;
        }
      }
      if (matched.length) hits.push({ file: path.relative(".", file).replaceAll("\\", "/"), barrel, matched });
    });
  }
}

console.log(`Found ${hits.length} self-barrel imports\n`);
for (const h of hits) {
  console.log(`${h.file}  (barrel: ${h.barrel})`);
  for (const m of h.matched) console.log(`  L${m.lineNo}: ${m.text}`);
  console.log();
}
