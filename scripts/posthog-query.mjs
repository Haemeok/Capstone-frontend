import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const loadEnvLocal = () => {
  let raw;
  try {
    raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, value] = match;
    if (!(key in process.env)) {
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  }
};

const printUsageAndExit = () => {
  console.error(
    'usage: node scripts/posthog-query.mjs "<HogQL>"\n       node scripts/posthog-query.mjs --file <query.sql>'
  );
  process.exit(1);
};

const readSql = () => {
  const args = process.argv.slice(2);
  if (args[0] === "--file") {
    if (!args[1]) printUsageAndExit();
    return readFileSync(resolve(args[1]), "utf8");
  }
  if (!args[0]) printUsageAndExit();
  return args[0];
};

loadEnvLocal();

const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
const projectId = process.env.POSTHOG_PROJECT_ID;
const host = process.env.POSTHOG_API_HOST ?? "https://us.posthog.com";

if (!apiKey || !projectId) {
  console.error(
    "Missing POSTHOG_PERSONAL_API_KEY or POSTHOG_PROJECT_ID (set them in .env.local)"
  );
  process.exit(1);
}

const sql = readSql();

const response = await fetch(
  new URL(`/api/projects/${projectId}/query/`, host),
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: { kind: "HogQLQuery", query: sql },
      name: "claude-posthog-query",
    }),
  }
);

if (!response.ok) {
  const body = await response.text();
  console.error(`PostHog API ${response.status}: ${body}`);
  process.exit(1);
}

const { columns, results } = await response.json();
const rows = results.map((row) =>
  Object.fromEntries(columns.map((column, index) => [column, row[index]]))
);

console.log(JSON.stringify({ rowCount: rows.length, rows }, null, 2));
