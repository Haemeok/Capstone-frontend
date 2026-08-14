import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..", "..");

const reportToCodex = (message) => {
  console.log(
    JSON.stringify({
      continue: true,
      systemMessage: message.slice(0, 8000),
    })
  );
};

const readStdin = () =>
  new Promise((resolve) => {
    let input = "";
    process.stdin.on("data", (chunk) => (input += chunk));
    process.stdin.on("end", () => resolve(input));
  });

const getChangedFiles = (command) => {
  const matches = command.matchAll(
    /^\*\*\* (?:(?:Add|Update) File|Move to): (.+)$/gm
  );
  return [...new Set([...matches].map((match) => match[1].trim()))].filter(
    (filePath) => {
      const absolutePath = path.resolve(projectRoot, filePath);
      const isInsideProject =
        absolutePath === projectRoot ||
        absolutePath.startsWith(`${projectRoot}${path.sep}`);
      return (
        isInsideProject &&
        /\.(?:ts|tsx)$/.test(filePath) &&
        existsSync(absolutePath)
      );
    }
  );
};

const raw = await readStdin();
let command = "";

try {
  command = JSON.parse(raw)?.tool_input?.command ?? "";
} catch {
  reportToCodex("Codex lint hook could not parse the hook payload.");
  process.exit(0);
}

const changedFiles = getChangedFiles(command);
if (changedFiles.length === 0) process.exit(0);

const eslintBin = path.join(
  projectRoot,
  "node_modules",
  "eslint",
  "bin",
  "eslint.js"
);
if (!existsSync(eslintBin)) {
  reportToCodex(
    "Codex lint hook could not find the project ESLint installation."
  );
  process.exit(0);
}

try {
  const output = execFileSync(
    process.execPath,
    [eslintBin, "--fix", ...changedFiles],
    {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  if (output.trim()) console.log(output);
} catch (error) {
  const report = `${error.stdout ?? ""}${error.stderr ?? ""}`.trim();
  reportToCodex(
    `[eslint] ${changedFiles.join(", ")}\n${report || "ESLint exited with an error."}`
  );
}

process.exit(0);
