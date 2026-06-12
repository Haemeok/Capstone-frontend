import { render, screen } from "@testing-library/react";

import { NotTranslatedBanner } from "../NotTranslatedBanner";

describe("NotTranslatedBanner", () => {
  it("T-10: 서버가 준 ja 메시지를 그대로 렌더한다", () => {
    render(
      <NotTranslatedBanner message="このレシピはまだ翻訳されていません。" />
    );
    expect(
      screen.getByText("このレシピはまだ翻訳されていません。")
    ).toBeInTheDocument();
  });
});
