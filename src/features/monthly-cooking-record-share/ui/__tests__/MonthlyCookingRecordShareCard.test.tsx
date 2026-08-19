import { render, screen, within } from "@testing-library/react";

import { MonthlyCookingRecordShareCard } from "../MonthlyCookingRecordShareCard";

jest.mock("next/navigation", () => ({
  usePathname: () => "/calendar/timeline/share",
}));

jest.mock("@/shared/hooks/useInViewOnce", () => ({
  useInViewOnce: () => ({ ref: jest.fn(), inView: false }),
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
        background={{
          backgroundKey: "DEFAULT",
          backgroundType: "PRESET",
          imageUrl: null,
        }}
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
        background={{
          backgroundKey: "DEFAULT",
          backgroundType: "PRESET",
          imageUrl: null,
        }}
      />
    );

    expect(screen.getAllByRole("presentation")).toHaveLength(30);
    expect(screen.queryByText("더 있어요")).not.toBeInTheDocument();
  });

  it("9개까지는 기존 3열 Grid와 스티커 크기를 유지합니다", () => {
    render(
      <MonthlyCookingRecordShareCard
        ariaLabel="공유 이미지"
        kicker="나의 요리 기록"
        monthLabel="2026년 8월"
        recordCountLabel="9개의 요리"
        brandLabel="RECIPIO"
        items={items.slice(0, 9)}
        background={null}
      />
    );

    const layout = screen.getByTestId("monthly-cooking-record-share-grid");
    const firstSticker = layout.querySelector('[data-share-sticker="true"]');

    expect(layout).toHaveClass("grid", "grid-cols-3");
    expect(firstSticker).toHaveClass("w-full", "h-20");
  });

  it("10개 이상은 마지막 줄을 가운데 정렬하는 4열 줄바꿈 배치를 사용합니다", () => {
    render(
      <MonthlyCookingRecordShareCard
        ariaLabel="공유 이미지"
        kicker="나의 요리 기록"
        monthLabel="2026년 8월"
        recordCountLabel="11개의 요리"
        brandLabel="RECIPIO"
        items={items.slice(0, 11)}
        background={null}
      />
    );

    const layout = screen.getByTestId("monthly-cooking-record-share-grid");
    const firstSticker = layout.querySelector('[data-share-sticker="true"]');

    expect(layout).toHaveClass("flex", "flex-wrap", "justify-center");
    expect(layout).not.toHaveClass("grid");
    expect(firstSticker).toHaveClass("basis-1/4", "h-[68px]");
  });

  it("viewport 밖에서도 공유 카드 스티커와 배경 이미지 로드를 시작합니다", () => {
    render(
      <MonthlyCookingRecordShareCard
        ariaLabel="2026년 8월 요리 기록 공유 이미지"
        kicker="나의 요리 기록"
        monthLabel="2026년 8월"
        recordCountLabel="2개의 요리"
        brandLabel="RECIPIO"
        items={items.slice(0, 2)}
        background={{
          backgroundKey: "PAPER_BEIGE",
          backgroundType: "PRESET",
          imageUrl: "/backgrounds/paper-beige.webp",
        }}
      />
    );

    expect(document.querySelector('img[src="/records/1.webp"]')).not.toBeNull();
    expect(document.querySelector('img[src="/records/2.webp"]')).not.toBeNull();
    expect(
      document.querySelector('img[src="/backgrounds/paper-beige.webp"]')
    ).not.toBeNull();
  });
});
