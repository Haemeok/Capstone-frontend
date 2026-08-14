import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..", "..");
const hookPath = path.join(scriptDirectory, "lint-changed.mjs");
const hooksConfigPath = path.join(projectRoot, ".codex", "hooks.json");
const temporaryRoot = await mkdtemp(
  path.join(os.tmpdir(), "recipio-codex-hook-")
);

try {
  const hooksConfig = JSON.parse(await readFile(hooksConfigPath, "utf8"));
  const applyPatchGroups = hooksConfig?.hooks?.PostToolUse ?? [];
  const applyPatchGroup = applyPatchGroups.find(
    (group) => group.matcher === "^apply_patch$"
  );
  assert.ok(applyPatchGroup, "apply_patch 훅 설정 누락");
  const lintHook = applyPatchGroup.hooks?.find(
    (hook) => hook.statusMessage === "Linting changed TypeScript files"
  );
  assert.equal(lintHook?.type, "command");
  assert.match(lintHook?.command ?? "", /git rev-parse --show-toplevel/);
  assert.match(lintHook?.commandWindows ?? "", /git rev-parse --show-toplevel/);
  assert.equal(lintHook?.timeout, 30);
  assert.equal((await stat(hookPath)).isFile(), true);

  const temporaryHookPath = path.join(
    temporaryRoot,
    "scripts",
    "codex",
    "lint-changed.mjs"
  );
  await mkdir(path.dirname(temporaryHookPath), { recursive: true });
  await copyFile(hookPath, temporaryHookPath);
  await mkdir(path.join(temporaryRoot, "node_modules", "eslint", "bin"), {
    recursive: true,
  });
  await mkdir(path.join(temporaryRoot, "src"), { recursive: true });
  await writeFile(
    path.join(temporaryRoot, "src", "added.ts"),
    "export const added = true;\n"
  );
  await writeFile(
    path.join(temporaryRoot, "src", "updated.tsx"),
    "export const Updated = () => null;\n"
  );
  await writeFile(
    path.join(temporaryRoot, "src", "moved.ts"),
    "export const moved = true;\n"
  );
  await writeFile(
    path.join(temporaryRoot, "src", "ignored.js"),
    "export const ignored = true;\n"
  );
  await writeFile(
    path.join(temporaryRoot, "node_modules", "eslint", "bin", "eslint.js"),
    'import { writeFileSync } from "node:fs";\nwriteFileSync("eslint-args.json", JSON.stringify(process.argv.slice(2)));\n'
  );
  await writeFile(
    path.join(temporaryRoot, "node_modules", "eslint", "package.json"),
    '{"type":"module"}\n'
  );

  const payload = {
    tool_input: {
      command: [
        "*** Begin Patch",
        "*** Add File: src/added.ts",
        "*** Update File: src/updated.tsx",
        "*** Update File: src/old.ts",
        "*** Move to: src/moved.ts",
        "*** Update File: src/ignored.js",
        "*** Delete File: src/deleted.ts",
        "*** Update File: src/missing.ts",
        "*** End Patch",
      ].join("\n"),
    },
  };

  const nestedDirectory = path.join(temporaryRoot, "src", "nested");
  await mkdir(nestedDirectory, { recursive: true });
  execFileSync(process.execPath, [temporaryHookPath], {
    cwd: nestedDirectory,
    input: JSON.stringify(payload),
    stdio: ["pipe", "pipe", "pipe"],
  });

  const args = JSON.parse(
    await readFile(path.join(temporaryRoot, "eslint-args.json"), "utf8")
  );
  assert.deepEqual(args, [
    "--fix",
    "src/added.ts",
    "src/updated.tsx",
    "src/moved.ts",
  ]);

  await writeFile(
    path.join(temporaryRoot, "node_modules", "eslint", "bin", "eslint.js"),
    'console.error("unfixable lint error");\nprocess.exit(1);\n'
  );
  const failureOutput = execFileSync(process.execPath, [temporaryHookPath], {
    cwd: nestedDirectory,
    input: JSON.stringify(payload),
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  const hookResponse = JSON.parse(failureOutput);
  assert.equal(hookResponse.continue, true);
  assert.match(hookResponse.systemMessage, /unfixable lint error/);
  console.log("Codex apply_patch 훅 검증 통과");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
