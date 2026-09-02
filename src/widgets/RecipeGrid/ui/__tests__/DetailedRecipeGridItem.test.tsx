import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    prefetch,
    ...props
  }: {
    children: React.ReactNode;
    prefetch?: boolean | null;
  }) => (
    <a {...props} data-prefetch={prefetch === null ? "null" : String(prefetch)}>
      {children}
    </a>
  ),
}));
jest.mock("@/shared/ui/image/Image", () => ({
  __esModule: true,
  Image: ({ alt }: { alt?: string }) => <img alt={alt ?? ""} />,
}));

import type { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe/model/types";

import DetailedRecipeGridItem from "../DetailedRecipeGridItem";

const baseRecipe: DetailedRecipeGridItemType = {
  id: "r1",
  title: "고추장 파스타",
  imageUrl: "https://img/r1.webp",
  authorName: "차경환",
  authorId: "a1",
  profileImage: "https://img/a1.webp",
  createdAt: "2026-06-01T00:00:00Z",
  favoriteByCurrentUser: false,
  source: "YOUTUBE",
  avgRating: 0,
  ratingCount: 0,
  creatorCountryTag: "JP",
};

const usRecipe: DetailedRecipeGridItemType = {
  id: "r-us",
  title: "버섯 치킨",
  imageUrl: "https://example.com/a.jpg",
  authorId: "a1",
  authorName: "달빛고래나무",
  profileImage: "https://example.com/p.jpg",
  createdAt: "2026-06-01T00:00:00",
  avgRating: 4.5,
  ratingCount: 10,
  favoriteByCurrentUser: false,
  source: "YOUTUBE",
  creatorCountryTag: "US",
};

const badgeRecipe: DetailedRecipeGridItemType = {
  ...baseRecipe,
  youtubeChannelName: "백수남편",
  youtubeChannelBadgeType: "CHEF",
};

describe("DetailedRecipeGridItem 국가 국기", () => {
  it("절약 배지가 없으면 JP 국기를 노출한다", () => {
    render(<DetailedRecipeGridItem recipe={baseRecipe} />);
    expect(screen.getByRole("img", { name: "일본 채널" })).toBeInTheDocument();
  });

  it("절약 배지가 있으면 국기를 숨긴다 (절약 우선)", () => {
    render(
      <DetailedRecipeGridItem
        recipe={baseRecipe}
        infoBadge={<span>1,000원 절약</span>}
      />
    );
    expect(screen.getByText("1,000원 절약")).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: "일본 채널" })
    ).not.toBeInTheDocument();
  });

  it("US 태그라도 infoBadge가 있으면 성조기를 숨긴다", () => {
    render(
      <DetailedRecipeGridItem
        recipe={usRecipe}
        infoBadge={<span>badge</span>}
      />
    );
    expect(
      screen.queryByRole("img", { name: "미국 채널" })
    ).not.toBeInTheDocument();
  });

  it("US 태그에 infoBadge가 없으면 성조기를 노출한다", () => {
    render(<DetailedRecipeGridItem recipe={usRecipe} />);
    expect(screen.getByRole("img", { name: "미국 채널" })).toBeInTheDocument();
  });
});

describe("DetailedRecipeGridItem 유튜브 채널 뱃지", () => {
  it("T-04: 셰프 레시피 뱃지를 YouTube 아이콘과 채널명 앞에 표시한다", () => {
    render(<DetailedRecipeGridItem recipe={badgeRecipe} />);

    const badgeLabel = screen.getByText("셰프 레시피");
    const channelName = screen.getByText("백수남편");
    const channelRow = channelName.parentElement;

    expect(channelRow?.children[0]).toContainElement(badgeLabel);
    expect(channelRow?.children[1].tagName.toLowerCase()).toBe("svg");
    expect(channelRow?.children[2]).toBe(channelName);
    expect(channelName).toHaveClass("min-w-0", "truncate");
  });

  it("T-04: 뱃지 타입이 없으면 기존 YouTube 채널 행만 유지한다", () => {
    render(
      <DetailedRecipeGridItem
        recipe={{
          ...badgeRecipe,
          youtubeChannelBadgeType: undefined,
        }}
      />
    );

    expect(screen.getByText("백수남편")).toBeInTheDocument();
    expect(screen.queryByText("셰프 레시피")).not.toBeInTheDocument();
    expect(screen.queryByText("유명 크리에이터")).not.toBeInTheDocument();
  });

  it("T-05: 비유튜브 레시피에는 뱃지 값이 있어도 표시하지 않는다", () => {
    render(
      <DetailedRecipeGridItem
        recipe={{
          ...badgeRecipe,
          source: "AI",
        }}
      />
    );

    expect(screen.queryByText("셰프 레시피")).not.toBeInTheDocument();
  });
});
