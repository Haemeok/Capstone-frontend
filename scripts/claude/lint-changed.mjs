import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const read = () =>
  new Promise((resolve) => {
    let s = "";
    process.stdin.on("data", (d) => (s += d));
    process.stdin.on("end", () => resolve(s));
  });

const raw = await read();
let filePath;
try {
  filePath = JSON.parse(raw)?.tool_input?.file_path;
} catch {
  process.exit(0);
}

if (!filePath || !/\.(ts|tsx)$/.test(filePath)) process.exit(0);

const eslintBin = path.resolve("node_modules/eslint/bin/eslint.js");
if (!existsSync(eslintBin)) process.exit(0);

try {
  const out = execFileSync(
    process.execPath,
    [eslintBin, "--fix", filePath],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
  if (out.trim()) console.log(out);
} catch (err) {
  const report = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
  if (report) console.log(`[eslint] ${filePath}\n${report}`);
}

process.exit(0);
