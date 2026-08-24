import { render, screen, within } from "@testing-library/react";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { getDictionary, type HomeDict } from "@/shared/i18n";

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt?: string }) => (
    <img src={src} alt={alt ?? ""} />
  ),
}));

import { HOME_QUICK_NAV_ITEMS } from "../config";
import HomeQuickNav from "../index";

type QuickNavMessages = HomeDict["quickNav"];

const koMessages: QuickNavMessages = {
  ariaLabel: "레시피 바로가기",
  trendMore: "트렌드 레시피 더보기",
  items: {
    chef: "셰프 레시피",
    youtube: "유튜브 레시피",
    quick: "초스피드",
    lateNight: "야식",
    diet: "다이어트",
    solo: "혼밥",
    kids: "아이와 함께",
    hangover: "해장",
    holiday: "기념일",
    airFryer: "에어프라이어",
  },
  compactItems: {
    chef: "셰프",
    youtube: "유튜브",
  },
};

const expectedItems = [
  {
    name: "셰프 레시피",
    href: "/recipes/category/CHEF_RECIPE",
    imageSrc: "/images/home-quick-nav/chef.png",
  },
  {
    name: "유튜브 레시피",
    href: "/search/results?types=YOUTUBE",
    imageSrc:
      "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/images/icons/youtube.webp",
  },
  {
    name: "초스피드",
    href: "/recipes/category/QUICK",
    imageSrc: "/images/home-quick-nav/quick.png",
  },
  {
    name: "야식",
    href: "/recipes/category/LATE_NIGHT",
    imageSrc: "/images/home-quick-nav/late-night.png",
  },
  {
    name: "다이어트",
    href: "/recipes/category/HEALTHY",
    imageSrc: "/images/home-quick-nav/diet.png",
  },
  {
    name: "혼밥",
    href: "/recipes/category/SOLO",
    imageSrc: "/images/home-quick-nav/solo.png",
  },
  {
    name: "아이와 함께",
    href: "/recipes/category/KIDS",
    imageSrc: "/images/home-quick-nav/kids.png",
  },
  {
    name: "해장",
    href: "/recipes/category/HANGOVER",
    imageSrc: "/images/home-quick-nav/hangover.png",
  },
  {
    name: "기념일",
    href: "/recipes/category/HOLIDAY",
    imageSrc: "/images/home-quick-nav/holiday.png",
  },
  {
    name: "에어프라이어",
    href: "/recipes/category/AIR_FRYER",
    imageSrc: "/images/home-quick-nav/air-fryer.png",
  },
] as const;

describe("HomeQuickNav", () => {
  it("빠른 레시피 탐색 링크를 이름 있는 navigation 영역으로 묶는다", () => {
    render(<HomeQuickNav locale="ko" messages={koMessages} />);

    expect(
      screen.getByRole("navigation", { name: "레시피 바로가기" })
    ).toBeInTheDocument();
  });

  it("사용자가 지정한 열 가지 탐색 항목을 순서대로 올바른 결과에 연결한다", () => {
    render(<HomeQuickNav locale="ko" messages={koMessages} />);

    const navigation = screen.getByRole("navigation", {
      name: "레시피 바로가기",
    });
    const itemLinks = within(navigation).getAllByRole("link").slice(0, 10);
    const itemImages = navigation.querySelectorAll("img");

    expect(itemLinks).toHaveLength(10);
    expectedItems.forEach((item, index) => {
      expect(itemLinks[index]).toHaveAccessibleName(item.name);
      expect(itemLinks[index]).toHaveAttribute("href", item.href);
      expect(itemImages[index]).toHaveAttribute("src", item.imageSrc);
      expect(itemImages[index]).toHaveAttribute("alt", "");
    });
  });

  it("화면이 참조하는 로컬 아이콘을 public 배포 결과에 모두 포함한다", () => {
    const localImagePaths = HOME_QUICK_NAV_ITEMS.flatMap((item) =>
      item.imageSrc.startsWith("/images/") ? [item.imageSrc] : []
    );

    expect(localImagePaths).toHaveLength(9);
    localImagePaths.forEach((imagePath) => {
      expect(existsSync(join(process.cwd(), "public", imagePath))).toBe(true);
    });
  });

  it("번역 화면에서도 열 가지 목적지와 최신 유튜브 더보기 경로에 locale을 유지한다", () => {
    render(<HomeQuickNav locale="ja" messages={koMessages} />);

    const navigation = screen.getByRole("navigation", {
      name: "레시피 바로가기",
    });
    const links = within(navigation).getAllByRole("link");

    expect(links[0]).toHaveAttribute(
      "href",
      "/ja/recipes/category/CHEF_RECIPE"
    );
    expect(links[1]).toHaveAttribute(
      "href",
      "/ja/search/results?types=YOUTUBE"
    );
    expect(links[9]).toHaveAttribute("href", "/ja/recipes/category/AIR_FRYER");
    expect(links[10]).toHaveAttribute(
      "href",
      "/ja/search/results?types=YOUTUBE&sort=createdAt%2CDESC"
    );
  });

  it("모바일 5열에서 데스크톱 10열로 바뀌며 각 항목은 충분한 클릭 영역을 갖는다", () => {
    render(<HomeQuickNav locale="ko" messages={koMessages} />);

    const navigation = screen.getByRole("navigation", {
      name: "레시피 바로가기",
    });
    const itemList = within(navigation).getByRole("list");
    const itemLinks = within(itemList).getAllByRole("link");

    expect(itemList).toHaveClass("grid-cols-5", "md:grid-cols-10");
    itemLinks.forEach((link) => {
      expect(link).toHaveClass("min-h-11");
    });
    expect(
      navigation.querySelectorAll('[data-icon-badge="true"]')
    ).toHaveLength(10);
  });

  it("트렌드 더보기는 굵거나 밑줄 친 제목이 아닌 가운데 정렬 링크로 제공된다", () => {
    render(<HomeQuickNav locale="ko" messages={koMessages} />);

    const trendLink = screen.getByRole("link", {
      name: "트렌드 레시피 더보기",
    });

    expect(trendLink).toHaveAttribute(
      "href",
      "/search/results?types=YOUTUBE&sort=createdAt%2CDESC"
    );
    expect(trendLink).toHaveClass(
      "min-h-13",
      "justify-center",
      "font-medium",
      "no-underline"
    );
    expect(trendLink.querySelector("strong")).toBeNull();
  });

  it("아주 좁은 화면에서는 첫 두 항목에 짧은 시각 라벨을 준비한다", () => {
    render(<HomeQuickNav locale="ko" messages={koMessages} />);

    const compactChefLabel = screen.getByText("셰프", {
      selector: "[data-compact-label]",
    });

    expect(compactChefLabel).toBeInTheDocument();
    expect(
      screen.getByText("유튜브", { selector: "[data-compact-label]" })
    ).toBeInTheDocument();
    expect(compactChefLabel.parentElement).toHaveClass(
      "max-[340px]:text-[10px]"
    );
  });

  it.each(["ko", "en", "ja"] as const)(
    "%s 홈 사전의 빠른 탐색 문구를 그대로 화면에 연결한다",
    (locale) => {
      const messages = getDictionary(locale).home.quickNav;

      const { container } = render(
        <HomeQuickNav locale={locale} messages={messages} />
      );
      const navigation = screen.getByRole("navigation", {
        name: messages.ariaLabel,
      });

      expect(within(navigation).getAllByRole("link")).toHaveLength(11);
      if (locale !== "ko") {
        expect(/[가-힣]/.test(container.textContent ?? "")).toBe(false);
      }
    }
  );
});
