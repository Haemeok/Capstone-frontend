import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const EXPECTED_SKILL_COUNT = 25;
const MAX_AGENTS_BYTES = 32 * 1024;
const projectRoot = process.cwd();
const skillsRoot = path.join(projectRoot, ".agents", "skills");
const evalPath = path.join(
  projectRoot,
  ".codex",
  "skill-evals",
  "trigger-cases.json"
);
const agentsPath = path.join(projectRoot, "AGENTS.md");
const techWritingSkillPath = path.join(skillsRoot, "tech-writing", "SKILL.md");
const techWritingReferences = [
  "article-architecture.md",
  "jasoseo-mode.md",
  "portfolio-blog-modes.md",
];
const errors = [];

const getStatus = async (filePath) => {
  try {
    return await stat(filePath);
  } catch {
    return null;
  }
};

const getLocalLinks = (content) => {
  const links = [];
  for (const match of content.matchAll(
    /\[[^\]]+\]\((<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\)/g
  )) {
    links.push(match[1]);
  }
  for (const match of content.matchAll(/^\s*\[[^\]]+\]:\s*(<[^>]+>|\S+)/gm)) {
    links.push(match[1]);
  }
  return links
    .map((link) => link.replace(/^<|>$/g, "").split("#")[0])
    .filter((link) => link && !/^(?:https?:|mailto:|\/)/.test(link));
};

const scanFiles = async (directory) => {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...(await scanFiles(fullPath)));
    else if (!entry.name.endsWith(".pyc")) results.push(fullPath);
  }
  return results;
};

const skillFolders = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
if (skillFolders.length !== EXPECTED_SKILL_COUNT) {
  errors.push(
    `스킬 개수 오류: 기대 ${EXPECTED_SKILL_COUNT}, 실제 ${skillFolders.length}`
  );
}

const skillNames = new Set();
for (const folder of skillFolders) {
  const skillPath = path.join(skillsRoot, folder, "SKILL.md");
  if (!(await getStatus(skillPath))?.isFile()) {
    errors.push(`SKILL.md 누락: ${folder}`);
    continue;
  }

  const content = await readFile(skillPath, "utf8");
  const name = folder;
  if (skillNames.has(name)) errors.push(`중복 스킬 이름: ${name}`);
  skillNames.add(name);
  if (content.split(/\r?\n/).length > 500)
    errors.push(`SKILL.md 500줄 초과: ${folder}`);

  const metadataPath = path.join(skillsRoot, folder, "agents", "openai.yaml");
  if (!(await getStatus(metadataPath))?.isFile()) {
    errors.push(`agents/openai.yaml 누락: ${folder}`);
  }

  for (const link of getLocalLinks(content)) {
    const target = path.resolve(path.dirname(skillPath), link);
    if (!(await getStatus(target)))
      errors.push(`깨진 SKILL.md 링크: ${folder} -> ${link}`);
  }
}

const evalCases = JSON.parse(await readFile(evalPath, "utf8"));
for (const skillName of skillNames) {
  const cases = evalCases.filter((entry) => entry.skill === skillName);
  if (!cases.some((entry) => entry.shouldTrigger === true))
    errors.push(`긍정 트리거 사례 누락: ${skillName}`);
  if (!cases.some((entry) => entry.shouldTrigger === false))
    errors.push(`부정 트리거 사례 누락: ${skillName}`);
}
for (const entry of evalCases) {
  if (!skillNames.has(entry.skill))
    errors.push(`존재하지 않는 평가 스킬: ${entry.skill}`);
  if (typeof entry.query !== "string" || entry.query.trim().length === 0)
    errors.push(`빈 평가 질의: ${entry.skill}`);
  if (typeof entry.shouldTrigger !== "boolean")
    errors.push(`잘못된 평가 기대값: ${entry.skill}`);
}

const techWritingContent = await readFile(techWritingSkillPath, "utf8");
const techWritingLinks = getLocalLinks(techWritingContent);
for (const referenceName of techWritingReferences) {
  const referenceLink = `references/${referenceName}`;
  const linkCount = techWritingLinks.filter(
    (link) => link === referenceLink
  ).length;
  if (linkCount !== 1) {
    errors.push(
      `tech-writing direct reference count mismatch: ${referenceName}`
    );
  }

  const referencePath = path.join(
    skillsRoot,
    "tech-writing",
    "references",
    referenceName
  );
  const referenceContent = await readFile(referencePath, "utf8");
  const lineCount = referenceContent.split(/\r?\n/).length;
  if (
    lineCount > 100 &&
    !/^## (?:목차|Table of Contents)$/m.test(referenceContent)
  ) {
    errors.push(`long tech-writing reference missing TOC: ${referenceName}`);
  }
  const nestedMarkdownLinks = getLocalLinks(referenceContent).filter((link) =>
    /\.md$/i.test(link)
  );
  if (nestedMarkdownLinks.length > 0) {
    errors.push(`nested tech-writing Markdown reference: ${referenceName}`);
  }
}

const legacyPatterns = [
  ["Claude Code 전용 명칭", /Claude Code/i],
  ["Claude 전용 경로", /\.claude[\\/]/i],
  ["Claude 플러그인 환경 변수", /CLAUDE_PLUGIN_ROOT/],
  ["Claude Task tool", /Task tool/],
  ["Claude Bash tool", /Bash tool/],
  ["Claude Write tool", /Write tool/],
  ["Claude 전용 HTML 식별자", /claude-content/i],
  ["Claude 전용 출력 설명", /Claude consumption/i],
];
const agentsStatus = await getStatus(agentsPath);
const legacyFiles = [
  ...(await scanFiles(skillsRoot)),
  ...(agentsStatus?.isFile() ? [agentsPath] : []),
];
for (const filePath of legacyFiles) {
  const content = await readFile(filePath, "utf8");
  for (const [label, pattern] of legacyPatterns) {
    if (pattern.test(content))
      errors.push(`${label} 잔여: ${path.relative(projectRoot, filePath)}`);
  }
}

if (!agentsStatus?.isFile()) {
  errors.push("AGENTS.md 누락");
} else {
  const agentsContent = await readFile(agentsPath, "utf8");
  if (Buffer.byteLength(agentsContent) > MAX_AGENTS_BYTES) {
    errors.push("AGENTS.md가 기본 32KiB 로딩 한도를 초과함");
  }
}
const stateStatus = await getStatus(
  path.join(projectRoot, ".codex", "state", "active-issue")
);
if (!stateStatus?.isFile()) errors.push(".codex/state/active-issue 파일 누락");

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Codex 마이그레이션 구조 검증 통과: 스킬 ${skillNames.size}개, 트리거 사례 ${evalCases.length}개`
);
