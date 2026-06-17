/** @jest-environment node */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { collectSourceFiles, findKoreanLeaks } from "../testing/staticScan";

it("T-06: 사전 import 파일에 면제 안 된 한국어 리터럴 누수가 없다", () => {
  const root = join(process.cwd(), "src");
  const violations = collectSourceFiles(root).flatMap((file) =>
    findKoreanLeaks(readFileSync(file, "utf8"), file)
  );
  const report = violations
    .map((v) => `${v.file}:${v.line} -> ${v.text}`)
    .join("\n");
  expect(report).toBe("");
});
