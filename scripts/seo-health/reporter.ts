import type { CheckResult } from "./types.js";

const STATUS_ICONS: Record<string, string> = {
  pass: "\u2705",
  fail: "\u274C",
  warn: "\u26A0\uFE0F",
};

export const formatResults = (results: CheckResult[]): string => {
  const lines: string[] = [];

  lines.push("=".repeat(60));
  lines.push("  SEO Health Check Report");
  lines.push(`  ${new Date().toISOString()}`);
  lines.push("=".repeat(60));
  lines.push("");

  for (const result of results) {
    const icon = STATUS_ICONS[result.status] ?? "?";
    lines.push(`${icon} ${result.name} — ${result.message}`);
    if (result.details) {
      lines.push(`   ${result.details}`);
    }
  }

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;
  const warned = results.filter((r) => r.status === "warn").length;

  lines.push("");
  lines.push("-".repeat(60));
  lines.push(
    `RESULT: ${passed} passed, ${failed} failed, ${warned} warnings`
  );

  if (failed > 0) {
    lines.push("");
    lines.push("FAILURES:");
    for (const result of results.filter((r) => r.status === "fail")) {
      lines.push(`  - ${result.name}: ${result.message}`);
    }
  }

  lines.push("-".repeat(60));
  return lines.join("\n");
};

export const reportAndExit = (results: CheckResult[]): never => {
  const output = formatResults(results);
  console.log(output);

  const hasFails = results.some((r) => r.status === "fail");
  process.exit(hasFails ? 1 : 0);
};
