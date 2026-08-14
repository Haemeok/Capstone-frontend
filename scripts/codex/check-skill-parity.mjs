import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const claudeRoot = path.join(projectRoot, ".claude", "skills");
const codexRoot = path.join(projectRoot, ".agents", "skills");
const overridesPath = path.join(
  projectRoot,
  "scripts",
  "codex",
  "skill-migration-overrides.json"
);

const normalizePath = (filePath) => filePath.split(path.sep).join("/");

const listFiles = async (root, current = root) => {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(root, fullPath)));
      continue;
    }

    if (entry.name.endsWith(".pyc") || entry.name === ".DS_Store") continue;
    files.push(normalizePath(path.relative(root, fullPath)));
  }

  return files.sort();
};

const textExtensions = new Set([
  ".cjs",
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".py",
  ".sh",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const digest = async (filePath) => {
  const bytes = await readFile(filePath);
  const content = textExtensions.has(path.extname(filePath).toLowerCase())
    ? Buffer.from(bytes.toString("utf8").replaceAll("\r\n", "\n"), "utf8")
    : bytes;
  return createHash("sha256").update(content).digest("hex");
};

const overrides = JSON.parse(await readFile(overridesPath, "utf8"));
const overridePaths = new Set(Object.keys(overrides));
const allowedTechWritingReferences = new Set([
  "tech-writing/references/article-architecture.md",
  "tech-writing/references/jasoseo-mode.md",
  "tech-writing/references/portfolio-blog-modes.md",
]);
const claudeFiles = await listFiles(claudeRoot);
const codexFiles = await listFiles(codexRoot);
const claudeSet = new Set(claudeFiles);
const codexSet = new Set(codexFiles);
const errors = [];

for (const relativePath of claudeFiles) {
  if (!codexSet.has(relativePath)) {
    errors.push(`Codex 누락: ${relativePath}`);
    continue;
  }

  const sourceHash = await digest(path.join(claudeRoot, relativePath));
  const targetHash = await digest(path.join(codexRoot, relativePath));
  if (sourceHash === targetHash) {
    if (overridePaths.has(relativePath)) {
      errors.push(`더 이상 필요하지 않은 차이 허용: ${relativePath}`);
    }
    continue;
  }

  const override = overrides[relativePath];
  if (!override) {
    errors.push(`승인되지 않은 내용 차이: ${relativePath}`);
    continue;
  }

  if (
    override.sourceSha256 !== sourceHash ||
    override.targetSha256 !== targetHash
  ) {
    errors.push(`승인 상태에서 변경된 내용 차이: ${relativePath}`);
  }
}

for (const relativePath of codexFiles) {
  if (claudeSet.has(relativePath)) continue;
  const isCodexMetadata = /^[^/]+\/agents\/openai\.yaml$/.test(relativePath);
  const isTechWritingReference = allowedTechWritingReferences.has(relativePath);
  if (!isCodexMetadata && !isTechWritingReference) {
    errors.push(`승인되지 않은 Codex 전용 파일: ${relativePath}`);
  }
}

for (const relativePath of overridePaths) {
  if (!claudeSet.has(relativePath) || !codexSet.has(relativePath)) {
    errors.push(`잘못된 차이 허용 경로: ${relativePath}`);
  }
  const override = overrides[relativePath];
  if (
    typeof override?.reason !== "string" ||
    override.reason.trim().length === 0 ||
    !/^[a-f0-9]{64}$/.test(override?.sourceSha256 ?? "") ||
    !/^[a-f0-9]{64}$/.test(override?.targetSha256 ?? "")
  ) {
    errors.push(`잘못된 차이 허용 형식: ${relativePath}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `스킬 패리티 통과: Claude ${claudeFiles.length}개, Codex ${codexFiles.length}개, 의도적 내용 차이 ${overridePaths.size}개`
);
