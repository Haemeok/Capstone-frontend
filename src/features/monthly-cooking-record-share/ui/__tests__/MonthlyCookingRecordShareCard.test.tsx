import { render, screen, within } from "@testing-library/react";

import type { CookingRecordListItem } from "@/entities/recipe";

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

const dishRecord: CookingRecordListItem = {
  recordId: "dish-record",
  recipeId: null,
  displayTitle: "접시 카레",
  ingredientCost: null,
  marketPrice: null,
  nutrition: null,
  calories: null,
  imageUrl: "/records/dish-original.webp",
  visibility: null,
  stickerImageUrl: null,
  stickerStatus: "NONE",
  cookedAt: "2026-08-17T12:00:00+09:00",
  createdAt: "2026-08-17T12:00:00+09:00",
  sourceType: "MANUAL",
  reviewId: null,
  recipeAvailable: false,
  savings: null,
  isRemix: null,
  displayMode: "DISH",
  croppedImageUrl: "/records/dish-cropped.webp",
  displayStyle: {
    plateId: "plate-1",
    plateImageUrl: "/plates/plate-1.webp",
    maskShape: "CIRCLE",
    crop: { centerX: 0.5, centerY: 0.5, zoom: 1 },
  },
};

describe("MonthlyCookingRecordShareCard", () => {
  it("접시 기록을 공유 이미지에서도 접시와 완성 사진으로 합성합니다", () => {
    render(
      <MonthlyCookingRecordShareCard
        ariaLabel="공유 이미지"
        kicker="나의 요리 기록"
        monthLabel="2026년 8월"
        recordCountLabel="1개의 요리"
        brandLabel="RECIPIO"
        items={[
          {
            id: dishRecord.recordId,
            title: dishRecord.displayTitle,
            imageUrl: dishRecord.imageUrl ?? "",
            imageAlt: dishRecord.displayTitle,
            record: dishRecord,
          },
        ]}
        background={null}
      />
    );

    const item = screen.getByTestId("saved-cooking-record-dish");
    expect(
      item.querySelector('img[src="/records/dish-cropped.webp"]')
    ).not.toBeNull();
    expect(
      screen
        .getByTestId("saved-cooking-record-plate")
        .querySelector('img[src="/plates/plate-1.webp"]')
    ).not.toBeNull();
    expect(
      document.querySelector('img[src="/records/dish-original.webp"]')
    ).toBeNull();
  });

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

  it("9개를 1px 간격의 3열 정렬로 촘촘하게 표시합니다", () => {
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

    expect(layout).toHaveClass("flex", "flex-wrap", "gap-px");
    expect(layout).toHaveStyle({ width: "254px" });
    expect(firstSticker).toHaveStyle({
      width: "84px",
      height: "84px",
      flexBasis: "84px",
    });
    expect(firstSticker?.className).not.toMatch(/rotate/);
  });

  it.each([
    [11, 315, 78],
    [20, 314, 62],
    [30, 305, 50],
  ])(
    "%i개를 행 너비 %ipx, 스티커 %ipx의 가운데 정렬로 표시합니다",
    (count, layoutWidth, itemSize) => {
      const layoutItems = Array.from({ length: count }, (_, index) => ({
        id: `layout-record-${index}`,
        title: `요리 ${index + 1}`,
        imageUrl: `/records/layout-${index + 1}.webp`,
        imageAlt: `요리 ${index + 1}`,
      }));

      render(
        <MonthlyCookingRecordShareCard
          ariaLabel="공유 이미지"
          kicker="나의 요리 기록"
          monthLabel="2026년 8월"
          recordCountLabel={`${count}개의 요리`}
          brandLabel="RECIPIO"
          items={layoutItems}
          background={null}
        />
      );

      const layout = screen.getByTestId("monthly-cooking-record-share-grid");
      const firstSticker = layout.querySelector('[data-share-sticker="true"]');

      expect(layout).toHaveClass(
        "flex",
        "flex-wrap",
        "justify-center",
        "gap-px"
      );
      expect(layout).not.toHaveClass("grid");
      expect(layout).toHaveStyle({ width: `${layoutWidth}px` });
      expect(firstSticker).toHaveStyle({
        width: `${itemSize}px`,
        height: `${itemSize}px`,
        flexBasis: `${itemSize}px`,
      });
    }
  );

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
