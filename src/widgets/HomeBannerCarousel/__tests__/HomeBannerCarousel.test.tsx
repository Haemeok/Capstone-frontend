import { act, render, screen } from "@testing-library/react";

import HomeBannerCarousel from "../index";
import { BannerSlide } from "../types";

let snapIndex = 0;
const selectHandlers: Array<() => void> = [];

const emblaApi = {
  selectedScrollSnap: () => snapIndex,
  scrollSnapList: () => [0, 0, 0],
  scrollNext: jest.fn(),
  scrollPrev: jest.fn(),
  on: (evt: string, cb: () => void) => {
    if (evt === "select") selectHandlers.push(cb);
  },
  off: jest.fn(),
};

const emblaCarouselMock = jest.fn((_opts?: unknown) => [jest.fn(), emblaApi]);

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: (opts: unknown) => emblaCarouselMock(opts),
}));

const SLIDES: BannerSlide[] = [
  {
    id: "youtube",
    chip: "#유튜브 레시피",
    title: "링크만 붙여넣으면 레시피 완성",
    ctaText: "링크로 레시피 만들기",
    link: "/recipes/new/youtube",
    backgroundColor: "#f87171",
    mainImage: "/youtube.webp",
  },
  {
    id: "world",
    chip: "#전 세계 레시피",
    title: "세계 각국 레시피 구경하기",
    ctaText: "나라별 레시피 보러 가기",
    link: "/events/world-recipes",
    backgroundColor: "#3b82f6",
    mainImage: "/world.png",
  },
  {
    id: "adfree",
    chip: "#광고 없는 6월",
    title: "친구 초대하면 광고가 사라져요",
    ctaText: "친구 초대하고 광고 끄기",
    link: "/events/ad-free-june",
    backgroundColor: "#8b5cf6",
    mainImage: "/adfree.png",
  },
];

beforeEach(() => {
  snapIndex = 0;
  selectHandlers.length = 0;
  emblaCarouselMock.mockClear();
});

describe("HomeBannerCarousel", () => {
  // T-01
  it("설정대로 슬라이드를 렌더하고 각 링크와 텍스트, 이미지, 배경색을 노출한다", () => {
    const { container } = render(<HomeBannerCarousel slides={SLIDES} />);

    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/recipes/new/youtube",
      "/events/world-recipes",
      "/events/ad-free-june",
    ]);

    expect(screen.getByText("#유튜브 레시피")).toBeInTheDocument();
    expect(
      screen.getByText("링크만 붙여넣으면 레시피 완성")
    ).toBeInTheDocument();
    expect(screen.getByText("나라별 레시피 보러 가기")).toBeInTheDocument();

    expect(links[0]).toHaveStyle({ backgroundColor: "#f87171" });

    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(3);
    expect(imgs[0]).toHaveAttribute("src", "/youtube.webp");
  });

  // T-02
  it("카운트 알약이 현재 위치를 보여주고 전환 시 갱신된다", () => {
    render(<HomeBannerCarousel slides={SLIDES} />);

    expect(screen.getByText("1/3")).toBeInTheDocument();

    act(() => {
      snapIndex = 1;
      selectHandlers.forEach((h) => h());
    });

    expect(screen.getByText("2/3")).toBeInTheDocument();
  });

  // T-03
  it("슬라이드가 여럿이면 loop을 켜고 하나면 끈다", () => {
    const { unmount } = render(<HomeBannerCarousel slides={SLIDES} />);
    expect(emblaCarouselMock).toHaveBeenCalledWith({
      loop: true,
      watchDrag: true,
    });

    unmount();
    emblaCarouselMock.mockClear();

    render(<HomeBannerCarousel slides={[SLIDES[0]]} />);
    expect(emblaCarouselMock).toHaveBeenCalledWith({
      loop: false,
      watchDrag: false,
    });
  });

  // T-06
  it("좌우 화살표 버튼과 진행바가 없다", () => {
    render(<HomeBannerCarousel slides={SLIDES} />);

    expect(screen.queryByLabelText("이전 슬라이드")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("다음 슬라이드")).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
