import { localizeTaxonomy, taxonomyLabel } from "../taxonomyLabel";
import { taxonomyMessages } from "../taxonomyMessages";

const ja = taxonomyMessages.ja;
const ko = taxonomyMessages.ko;

describe("taxonomyLabel (code in hand)", () => {
  it("T-04: 코드→locale 라벨을 반환한다", () => {
    expect(taxonomyLabel("USER", "recipeType", ja)).toBe(ja.recipeType.USER);
  });
  it("T-04: ko 사전이면 한글 라벨", () => {
    expect(taxonomyLabel("USER", "recipeType", ko)).toBe("사용자 레시피");
  });
  it("T-04: 미지원 코드는 코드 자체로 fallback(throw 안 함)", () => {
    expect(taxonomyLabel("ZZZ", "recipeType", ja)).toBe("ZZZ");
  });
});

describe("localizeTaxonomy (ko canonical in hand)", () => {
  it("T-04: ko locale은 입력 그대로", () => {
    expect(localizeTaxonomy("사용자 레시피", "recipeType", ko)).toBe(
      "사용자 레시피"
    );
  });
  it("T-04: ko 라벨(태그) → ja 라벨", () => {
    expect(localizeTaxonomy("야식", "tags", taxonomyMessages.ja)).toBe(
      taxonomyMessages.ja.tags.LATE_NIGHT
    );
  });
  it("T-04: ko locale 태그는 입력 그대로", () => {
    expect(localizeTaxonomy("야식", "tags", taxonomyMessages.ko)).toBe("야식");
  });
  it("T-04: 전체는 ALL 코드로 매핑", () => {
    expect(localizeTaxonomy("전체", "dishType", taxonomyMessages.ja)).toBe(
      taxonomyMessages.ja.dishType.ALL
    );
  });
  it("T-04: 미지원 ko 라벨은 입력 그대로 fallback", () => {
    expect(localizeTaxonomy("없는라벨", "tags", taxonomyMessages.ja)).toBe(
      "없는라벨"
    );
  });
});
