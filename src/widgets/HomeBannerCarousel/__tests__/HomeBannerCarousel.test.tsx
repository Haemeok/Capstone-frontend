import { act, render, screen } from "@testing-library/react";

import HomeBannerCarousel from "../index";
import { HOME_BANNER_SLIDES } from "../slides";

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

beforeEach(() => {
  snapIndex = 0;
  selectHandlers.length = 0;
  emblaCarouselMock.mockClear();
});

describe("HomeBannerCarousel", () => {
  // T-01
  it("설정대로 슬라이드를 렌더하고 각 링크와 텍스트, 이미지, 배경색을 노출한다", () => {
    const { container } = render(
      <HomeBannerCarousel slides={HOME_BANNER_SLIDES} />
    );

    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(
      HOME_BANNER_SLIDES.map((slide) => slide.link)
    );

    HOME_BANNER_SLIDES.forEach((slide) => {
      if (slide.chip) {
        expect(screen.getByText(slide.chip)).toBeInTheDocument();
      }
      expect(screen.getByText(slide.title)).toBeInTheDocument();
    });

    expect(links[0]).toHaveStyle({
      backgroundColor: HOME_BANNER_SLIDES[0].backgroundColor,
    });

    const imgs = container.querySelectorAll("img");
    expect(imgs).toHaveLength(HOME_BANNER_SLIDES.length);
    expect(imgs[0]).toHaveAttribute("src", HOME_BANNER_SLIDES[0].mainImage);
  });

  // T-02
  it("카운트 알약이 현재 위치를 보여주고 전환 시 갱신된다", () => {
    const total = HOME_BANNER_SLIDES.length;

    render(<HomeBannerCarousel slides={HOME_BANNER_SLIDES} />);

    expect(screen.getByText(`1/${total}`)).toBeInTheDocument();

    act(() => {
      snapIndex = 1;
      selectHandlers.forEach((h) => h());
    });

    expect(screen.getByText(`2/${total}`)).toBeInTheDocument();
  });

  // T-03
  it("슬라이드가 여럿이면 loop을 켜고 하나면 끈다", () => {
    const { unmount } = render(
      <HomeBannerCarousel slides={HOME_BANNER_SLIDES} />
    );
    expect(emblaCarouselMock).toHaveBeenCalledWith({
      loop: true,
      watchDrag: true,
    });

    unmount();
    emblaCarouselMock.mockClear();

    render(<HomeBannerCarousel slides={[HOME_BANNER_SLIDES[0]]} />);
    expect(emblaCarouselMock).toHaveBeenCalledWith({
      loop: false,
      watchDrag: false,
    });
  });

  // T-06
  it("좌우 화살표 버튼과 진행바가 없다", () => {
    render(<HomeBannerCarousel slides={HOME_BANNER_SLIDES} />);

    expect(screen.queryByLabelText("이전 슬라이드")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("다음 슬라이드")).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
