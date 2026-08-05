import { metadata as enMetadata } from "@/app/en/recipes/new/ai/layout";
import { metadata as jaMetadata } from "@/app/ja/recipes/new/ai/layout";
import { metadata as koMetadata } from "@/app/recipes/new/ai/layout";

describe("AI 레시피 생성 페이지 색인 정책", () => {
  it.each([
    ["ko", koMetadata],
    ["en", enMetadata],
    ["ja", jaMetadata],
  ])("%s: robots는 index, follow", (_locale, metadata) => {
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it.each([
    ["en", enMetadata],
    ["ja", jaMetadata],
  ])(
    "%s: 로케일 레이아웃의 Yeti noindex를 index로 덮는다",
    (_locale, metadata) => {
      expect(metadata.other).toEqual({ Yeti: "index, follow" });
    }
  );
});
