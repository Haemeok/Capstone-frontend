import { render, screen, within } from "@testing-library/react";

import { MonthlyCookingRecordShareCard } from "../MonthlyCookingRecordShareCard";

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const items = Array.from({ length: 18 }, (_, index) => ({
  id: `record-${index}`,
  title: `요리 ${index + 1}`,
  imageUrl: `/records/${index + 1}.webp`,
  imageAlt: `요리 ${index + 1}`,
}));

describe("MonthlyCookingRecordShareCard", () => {
  it("월·전체 개수·스티커·12px 브랜드만 1대1 카드에 표시합니다", () => {
    render(
      <MonthlyCookingRecordShareCard
        ariaLabel="2026년 8월 요리 기록 공유 이미지"
        kicker="나의 요리 기록"
        monthLabel="2026년 8월"
        recordCountLabel="18개의 요리"
        brandLabel="RECIPIO"
        items={items}
        background={{ backgroundKey: "DEFAULT", imageUrl: null }}
      />
    );

    const card = screen.getByRole("img", {
      name: "2026년 8월 요리 기록 공유 이미지",
    });
    expect(card).toHaveClass("aspect-square");
    expect(within(card).getAllByRole("presentation")).toHaveLength(18);
    expect(within(card).getByText("RECIPIO")).toHaveClass(
      "text-xs",
      "font-bold"
    );
    expect(within(card).getByText("18개의 요리")).toHaveClass(
      "bg-white/85",
      "shadow-sm"
    );
    expect(within(card).queryByText("아낀 금액")).not.toBeInTheDocument();
    expect(
      within(card).getByTestId("monthly-cooking-record-share-grid")
    ).toHaveClass("grid-cols-4");
  });

  it("31개가 넘어도 최신 30개만 렌더링합니다", () => {
    const manyItems = Array.from({ length: 31 }, (_, index) => ({
      id: `record-${index}`,
      title: `요리 ${index + 1}`,
      imageUrl: `/records/${index + 1}.webp`,
      imageAlt: `요리 ${index + 1}`,
    }));

    render(
      <MonthlyCookingRecordShareCard
        ariaLabel="공유 이미지"
        kicker="나의 요리 기록"
        monthLabel="2026년 8월"
        recordCountLabel="31개의 요리"
        brandLabel="RECIPIO"
        items={manyItems}
        background={{ backgroundKey: "DEFAULT", imageUrl: null }}
      />
    );

    expect(screen.getAllByRole("presentation")).toHaveLength(30);
    expect(screen.queryByText("더 있어요")).not.toBeInTheDocument();
  });
});
