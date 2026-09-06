import yaml from "js-yaml";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const EXPECTED_SKILL_COUNT = 25;
const SKILL_KEYS = new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
]);
const REQUIRED_INTERFACE_KEYS = [
  "display_name",
  "short_description",
  "default_prompt",
];
const NAME_PATTERN = /^[a-z0-9-]+$/;
const projectRoot = process.cwd();
const skillsRoot = path.join(projectRoot, ".agents", "skills");
const errors = [];

const parseYaml = (content, label) => {
  try {
    return yaml.load(content, { json: false });
  } catch (error) {
    errors.push(`YAML parse error: ${label}: ${error.message}`);
    return null;
  }
};

const unexpectedKeys = (value, allowed) =>
  Object.keys(value).filter((key) => !allowed.has(key));

const validateSkill = async (skillPath, folder) => {
  const content = await readFile(skillPath, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    errors.push(`frontmatter missing: ${folder}`);
    return;
  }

  const frontmatter = parseYaml(match[1], skillPath);
  if (
    !frontmatter ||
    typeof frontmatter !== "object" ||
    Array.isArray(frontmatter)
  ) {
    errors.push(`frontmatter must be a mapping: ${folder}`);
    return;
  }

  const unexpected = unexpectedKeys(frontmatter, SKILL_KEYS);
  if (unexpected.length > 0) {
    errors.push(
      `unsupported SKILL.md keys: ${folder} / ${unexpected.join(", ")}`
    );
  }

  const { name, description } = frontmatter;
  if (typeof name !== "string") {
    errors.push(`skill name must be a string: ${folder}`);
  } else {
    if (name !== folder)
      errors.push(`folder/name mismatch: ${folder} / ${name}`);
    if (name.length > 64 || !NAME_PATTERN.test(name)) {
      errors.push(`invalid skill name syntax: ${folder} / ${name}`);
    }
    if (name.startsWith("-") || name.endsWith("-") || name.includes("--")) {
      errors.push(`invalid skill name separator: ${folder} / ${name}`);
    }
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    errors.push(`skill description must be a non-empty string: ${folder}`);
  } else if (
    description.length > 1024 ||
    description.includes("<") ||
    description.includes(">")
  ) {
    errors.push(`invalid skill description length or brackets: ${folder}`);
  }
};

const validateMetadataLayout = (content, folder) => {
  const significantLines = content
    .split(/\r?\n/)
    .filter((line) => line.trim() && !/^\s*#/.test(line));
  if (significantLines[0] !== "interface:" || significantLines.length !== 4) {
    errors.push(`openai.yaml layout invalid: ${folder}`);
    return;
  }

  const fields = new Set();
  for (const line of significantLines.slice(1)) {
    const match = line.match(
      /^  ([a-z_]+): ("(?:[^"\\]|\\.)*"|'(?:[^']|'')*')$/
    );
    if (!match) {
      errors.push(`openai.yaml values must use quoted block fields: ${folder}`);
      continue;
    }
    fields.add(match[1]);
  }
  if (
    fields.size !== 3 ||
    REQUIRED_INTERFACE_KEYS.some((field) => !fields.has(field))
  ) {
    errors.push(`openai.yaml quoted fields mismatch: ${folder}`);
  }
};

const validateOpenAi = async (metadataPath, folder) => {
  const content = await readFile(metadataPath, "utf8");
  const metadata = parseYaml(content, metadataPath);
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    errors.push(`openai.yaml must be a mapping: ${folder}`);
    return;
  }

  if (Object.keys(metadata).length !== 1 || !("interface" in metadata)) {
    errors.push(`openai.yaml must contain only interface: ${folder}`);
  }
  const { interface: interfaceMetadata } = metadata;
  if (
    !interfaceMetadata ||
    typeof interfaceMetadata !== "object" ||
    Array.isArray(interfaceMetadata)
  ) {
    errors.push(`openai.yaml interface missing or invalid: ${folder}`);
    return;
  }

  const interfaceKeys = Object.keys(interfaceMetadata).sort();
  const requiredKeys = [...REQUIRED_INTERFACE_KEYS].sort();
  if (interfaceKeys.join("\0") !== requiredKeys.join("\0")) {
    errors.push(`openai.yaml interface fields mismatch: ${folder}`);
  }
  validateMetadataLayout(content, folder);

  for (const field of REQUIRED_INTERFACE_KEYS) {
    const value = interfaceMetadata[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`openai.yaml ${field} missing or empty: ${folder}`);
    }
  }

  const shortDescription = interfaceMetadata.short_description;
  if (
    typeof shortDescription === "string" &&
    !(
      shortDescription.trim().length >= 25 &&
      shortDescription.trim().length <= 64
    )
  ) {
    errors.push(`short_description length invalid: ${folder}`);
  }

  const defaultPrompt = interfaceMetadata.default_prompt;
  if (typeof defaultPrompt === "string") {
    const tokenPattern = new RegExp(`\\$${folder}(?![a-z0-9-])`, "g");
    if ([...defaultPrompt.matchAll(tokenPattern)].length !== 1) {
      errors.push(`default_prompt skill token invalid: ${folder}`);
    }
  }
};

const skillFolders = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (skillFolders.length !== EXPECTED_SKILL_COUNT) {
  errors.push(
    `skill count mismatch: expected ${EXPECTED_SKILL_COUNT}, got ${skillFolders.length}`
  );
}

for (const folder of skillFolders) {
  await validateSkill(path.join(skillsRoot, folder, "SKILL.md"), folder);
  await validateOpenAi(
    path.join(skillsRoot, folder, "agents", "openai.yaml"),
    folder
  );
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Codex skill YAML validation passed: ${skillFolders.length}`);
