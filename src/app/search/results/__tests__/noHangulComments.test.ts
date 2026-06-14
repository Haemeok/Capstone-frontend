import { readFileSync } from "fs";
import { join } from "path";

describe("search/results/page.tsx hygiene — T-08", () => {
  it("has no Hangul in comment lines", () => {
    const src = readFileSync(
      join(process.cwd(), "src/app/search/results/page.tsx"),
      "utf8"
    );
    const commentLines = src
      .split("\n")
      .filter((l) => l.trim().startsWith("//") || l.trim().startsWith("*"));
    const offending = commentLines.filter((l) => /[가-힣]/.test(l));
    expect(offending).toEqual([]);
  });
});
