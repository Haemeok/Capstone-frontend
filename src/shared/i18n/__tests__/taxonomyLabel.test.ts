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
});
