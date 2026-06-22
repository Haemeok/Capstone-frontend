/** @jest-environment node */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { collectDisplayLeaks, leakFiles } from "../testing/leakScanConfig";

const allowlist: string[] = JSON.parse(
  readFileSync(
    join(process.cwd(), "src/shared/i18n/testing/i18n-leak-allowlist.json"),
    "utf8"
  )
);

const current = leakFiles(collectDisplayLeaks(join(process.cwd(), "src")));

describe("T-13: 표시 컨텍스트 한국어 누출 가드 (allowlist 기준)", () => {
  it("allowlist 밖 파일에 새 한국어 표시 누출이 없다", () => {
    const introduced = current.filter((f) => !allowlist.includes(f));
    expect(introduced).toEqual([]);
  });

  it("allowlist에 더 이상 누출 없는 파일이 남아있지 않다 (수정 후 pruning 강제)", () => {
    const stale = allowlist.filter((f) => !current.includes(f));
    expect(stale).toEqual([]);
  });
});
