import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PROJECT = process.env.GA4_BQ_PROJECT ?? "react-craft-2dd07";
const DATASET = process.env.GA4_BQ_DATASET ?? "analytics_459701433";
const LOCATION = process.env.GA4_BQ_LOCATION ?? "asia-northeast3";

const SDK = `${process.env.LOCALAPPDATA}\\Google\\Cloud SDK\\google-cloud-sdk`;
const GCLOUD = `${SDK}\\bin\\gcloud.cmd`;
const BUNDLED_PY = `${SDK}\\platform\\bundledpython\\python.exe`;

const printUsageAndExit = () => {
  console.error(
    'usage: node scripts/ga4-query.mjs "<StandardSQL>"\n       node scripts/ga4-query.mjs --file <query.sql>\n\n{events} expands to the wildcard table `<project>.<dataset>.events_*`'
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
  return args.join(" ");
};

const getToken = () =>
  execSync(`"${GCLOUD}" auth print-access-token`, {
    env: { ...process.env, CLOUDSDK_PYTHON: BUNDLED_PY },
    encoding: "utf8",
  }).trim();

const sql = readSql().replaceAll(
  "{events}",
  `\`${PROJECT}.${DATASET}.events_*\``
);

const token = getToken();

const response = await fetch(
  `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT}/queries`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: sql,
      useLegacySql: false,
      location: LOCATION,
    }),
  }
);

const data = await response.json();

if (data.error || !response.ok) {
  console.error(JSON.stringify(data.error ?? data, null, 2));
  process.exit(1);
}

const columns = (data.schema?.fields ?? []).map((field) => field.name);
const rows = (data.rows ?? []).map((row) =>
  Object.fromEntries(row.f.map((cell, index) => [columns[index], cell.v]))
);

console.log(
  JSON.stringify({ rowCount: Number(data.totalRows ?? 0), rows }, null, 2)
);
