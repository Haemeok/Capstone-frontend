import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const projectRoot = process.cwd();
const temporaryRoot = await mkdtemp(
  path.join(os.tmpdir(), "recipio-codex-migration-")
);

const copyProjectPath = async (relativePath) => {
  await cp(
    path.join(projectRoot, relativePath),
    path.join(temporaryRoot, relativePath),
    {
      recursive: true,
    }
  );
};

const expectCommandFailure = (command, args, expectedMessage) => {
  try {
    execFileSync(command, args, {
      cwd: temporaryRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    assert.fail(`${command} ${args.join(" ")}가 실패해야 합니다.`);
  } catch (error) {
    const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    assert.match(output, expectedMessage);
  }
};

const expectNodeFailure = (script, expectedMessage) => {
  expectCommandFailure(process.execPath, [script], expectedMessage);
};

try {
  for (const relativePath of [
    ".claude/skills",
    ".agents/skills",
    ".codex",
    "scripts/codex",
    "AGENTS.md",
  ]) {
    await copyProjectPath(relativePath);
  }

  const parityScript = path.join(
    temporaryRoot,
    "scripts",
    "codex",
    "check-skill-parity.mjs"
  );
  const validateScript = path.join(
    temporaryRoot,
    "scripts",
    "codex",
    "validate-skill-migration.mjs"
  );
  const hookTestScript = path.join(
    temporaryRoot,
    "scripts",
    "codex",
    "test-lint-changed.mjs"
  );
  const yamlValidationScript = path.join(
    projectRoot,
    "scripts",
    "codex",
    "validate-skill-yaml.mjs"
  );

  const overrideTarget = path.join(
    temporaryRoot,
    ".agents",
    "skills",
    "brainstorming",
    "scripts",
    "frame-template.html"
  );
  const originalOverrideTarget = await readFile(overrideTarget, "utf8");
  await writeFile(overrideTarget, `${originalOverrideTarget}\ncorrupted\n`);
  expectNodeFailure(parityScript, /승인 상태에서 변경된 내용 차이/);
  await writeFile(overrideTarget, originalOverrideTarget);

  const metadataPath = path.join(
    temporaryRoot,
    ".agents",
    "skills",
    "brainstorming",
    "agents",
    "openai.yaml"
  );
  const originalMetadata = await readFile(metadataPath, "utf8");
  await rm(metadataPath);
  expectNodeFailure(validateScript, /agents\/openai\.yaml 누락/);
  await writeFile(metadataPath, originalMetadata);

  await writeFile(
    metadataPath,
    originalMetadata.replace(/display_name:.*$/m, 'display_name: "unterminated')
  );
  expectNodeFailure(yamlValidationScript, /YAML parse error/);
  await writeFile(metadataPath, originalMetadata);

  const metadataWithComment = originalMetadata.replace(
    /^interface:/m,
    "# YAML comments are allowed.\ninterface:"
  );
  await writeFile(metadataPath, metadataWithComment);
  execFileSync(process.execPath, [yamlValidationScript], {
    cwd: temporaryRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });
  await writeFile(metadataPath, originalMetadata);

  await writeFile(
    metadataPath,
    originalMetadata.concat("policy:\n  allow_implicit_invocation: true\n")
  );
  expectNodeFailure(yamlValidationScript, /must contain only interface/);
  await writeFile(metadataPath, originalMetadata);

  await writeFile(
    metadataPath,
    originalMetadata.replace(
      /^  display_name: "([^"]+)"$/m,
      "  display_name: $1"
    )
  );
  expectNodeFailure(
    yamlValidationScript,
    /values must use quoted block fields/
  );
  await writeFile(metadataPath, originalMetadata);

  await writeFile(
    metadataPath,
    originalMetadata.replace(
      /^(  short_description:.*)$/m,
      '$1\n  short_description: "duplicate"'
    )
  );
  expectNodeFailure(yamlValidationScript, /duplicated mapping key/);
  await writeFile(metadataPath, originalMetadata);

  await writeFile(
    metadataPath,
    originalMetadata.replace("$brainstorming", "$brainstorming-extra")
  );
  expectNodeFailure(yamlValidationScript, /default_prompt skill token invalid/);
  await writeFile(metadataPath, originalMetadata);

  const longReferencePath = path.join(
    temporaryRoot,
    ".agents",
    "skills",
    "tech-writing",
    "references",
    "jasoseo-mode.md"
  );
  const originalLongReference = await readFile(longReferencePath, "utf8");
  await writeFile(
    longReferencePath,
    originalLongReference.replace(/^## 목차\r?\n/m, "")
  );
  expectNodeFailure(validateScript, /long tech-writing reference missing TOC/);
  await writeFile(longReferencePath, originalLongReference);

  const llmSkillPath = path.join(
    temporaryRoot,
    ".agents",
    "skills",
    "llm-integration",
    "SKILL.md"
  );
  const originalLlmSkill = await readFile(llmSkillPath, "utf8");
  await writeFile(
    llmSkillPath,
    `${originalLlmSkill}\nAnthropic Claude API provider guidance.\n`
  );
  execFileSync(process.execPath, [validateScript], {
    cwd: temporaryRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });
  await writeFile(llmSkillPath, originalLlmSkill);

  const hooksPath = path.join(temporaryRoot, ".codex", "hooks.json");
  const hooks = JSON.parse(await readFile(hooksPath, "utf8"));
  hooks.hooks.PostToolUse.push({
    matcher: "^shell_command$",
    hooks: [
      { type: "command", command: "node scripts/example.mjs", timeout: 5 },
    ],
  });
  await writeFile(hooksPath, `${JSON.stringify(hooks, null, 2)}\n`);
  execFileSync(process.execPath, [hookTestScript], {
    cwd: temporaryRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });
  hooks.hooks.PostToolUse[0].matcher = "^Bash$";
  await writeFile(hooksPath, `${JSON.stringify(hooks, null, 2)}\n`);
  expectNodeFailure(hookTestScript, /apply_patch 훅 설정 누락/);

  console.log("Codex 마이그레이션 검사 변형 테스트 통과");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
