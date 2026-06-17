/** @jest-environment node */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  collectI18nTestFiles,
  findJapaneseLiterals,
} from "../testing/staticScan";

it("T-12: *.i18n.test.* 에 면제 안 된 일본어 리터럴이 없다", () => {
  const root = join(process.cwd(), "src");
  const violations = collectI18nTestFiles(root).flatMap((file) =>
    findJapaneseLiterals(readFileSync(file, "utf8"), file)
  );
  const report = violations
    .map((v) => `${v.file}:${v.line} -> ${v.text}`)
    .join("\n");
  expect(report).toBe("");
});
