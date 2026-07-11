import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { markImageLoaded } from "@/shared/lib/loadedImageRegistry";
import { Image } from "@/shared/ui/image";

jest.mock("next/navigation", () => ({ usePathname: () => "/" }));

const skeletonOf = (container: HTMLElement) =>
  container.querySelector('[data-slot="skeleton"]');

describe("Image 로드 기억", () => {
  test("T-03: 최초 로드 이미지는 스켈레톤 → 로드 후 표시 순서를 유지한다", async () => {
    const src = "https://cdn.recipio.kr/first.jpg";
    const { container } = render(
      <Image src={src} lazy={false} alt="최초 로드" />
    );

    expect(skeletonOf(container)).toBeInTheDocument();
    const img = screen.getByAltText("최초 로드");
    expect(img.parentElement).toHaveClass("opacity-0");

    fireEvent.load(img);

    await waitFor(() => expect(skeletonOf(container)).not.toBeInTheDocument());
    expect(img.parentElement).toHaveClass("opacity-100");
  });

  test("T-04: 로드 성공한 src는 remount 시 스켈레톤 없이 첫 렌더부터 표시된다", async () => {
    const src = "https://cdn.recipio.kr/back.jpg";
    const first = render(<Image src={src} lazy={false} alt="뒤로가기" />);
    fireEvent.load(screen.getByAltText("뒤로가기"));
    await waitFor(() =>
      expect(skeletonOf(first.container)).not.toBeInTheDocument()
    );
    first.unmount();

    const second = render(<Image src={src} lazy={false} alt="뒤로가기" />);

    expect(skeletonOf(second.container)).not.toBeInTheDocument();
    const img = screen.getByAltText("뒤로가기");
    expect(img).toHaveAttribute("src", src);
    expect(img.parentElement).toHaveClass("opacity-100");
  });

  test("T-05: 기억된 이미지는 뷰포트 대기 없이 즉시 img가 존재한다", () => {
    const src = "https://cdn.recipio.kr/lazy.jpg";
    markImageLoaded(src);

    render(<Image src={src} alt="뷰포트 밖" />);

    const img = screen.getByAltText("뷰포트 밖");
    expect(img).toHaveAttribute("src", src);
    expect(img.parentElement).toHaveClass("opacity-100");
  });

  test("T-06: 에러로 끝난 src는 기억되지 않아 remount 시 스켈레톤부터 시작한다", () => {
    jest.useFakeTimers();
    try {
      const src = "https://cdn.recipio.kr/broken.jpg";
      const first = render(<Image src={src} lazy={false} alt="깨진 이미지" />);

      fireEvent.error(screen.getByAltText("깨진 이미지"));
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      fireEvent.error(screen.getByAltText("깨진 이미지"));
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      fireEvent.error(screen.getByAltText("깨진 이미지"));
      first.unmount();

      const second = render(<Image src={src} lazy={false} alt="깨진 이미지" />);

      expect(skeletonOf(second.container)).toBeInTheDocument();
      expect(screen.getByAltText("깨진 이미지").parentElement).toHaveClass(
        "opacity-0"
      );
    } finally {
      jest.useRealTimers();
    }
  });

  test("T-10: 표시 중 src가 기억에 없는 src로 바뀌면 최초 로드 연출을 탄다", async () => {
    const remembered = "https://cdn.recipio.kr/a-remembered.jpg";
    const fresh = "https://cdn.recipio.kr/b-fresh.jpg";
    markImageLoaded(remembered);

    const { container, rerender } = render(
      <Image src={remembered} lazy={false} alt="교체 이미지" />
    );
    expect(skeletonOf(container)).not.toBeInTheDocument();

    rerender(<Image src={fresh} lazy={false} alt="교체 이미지" />);

    expect(skeletonOf(container)).toBeInTheDocument();
    const img = screen.getByAltText("교체 이미지");
    expect(img).toHaveAttribute("src", fresh);

    fireEvent.load(img);
    await waitFor(() => expect(skeletonOf(container)).not.toBeInTheDocument());
  });

  test("T-07: 기억된 이미지는 remount 시 페이드(transition) 없이 표시된다", () => {
    const src = "https://cdn.recipio.kr/no-fade.jpg";
    markImageLoaded(src);

    render(<Image src={src} lazy={false} alt="페이드 없음" />);

    const wrapper = screen.getByAltText("페이드 없음").parentElement;
    expect(wrapper).not.toHaveClass("transition-opacity");
    expect(wrapper).toHaveClass("opacity-100");
  });

  test("T-08: 최초 로드 이미지는 기존 300ms 페이드인을 유지한다", async () => {
    const src = "https://cdn.recipio.kr/fade.jpg";

    render(<Image src={src} lazy={false} alt="페이드 유지" />);

    const img = screen.getByAltText("페이드 유지");
    const wrapper = img.parentElement;
    expect(wrapper).toHaveClass("transition-opacity");
    expect(wrapper).toHaveClass("duration-300");

    fireEvent.load(img);

    await waitFor(() => expect(wrapper).toHaveClass("opacity-100"));
    expect(wrapper).toHaveClass("transition-opacity");
  });

  test("T-09: priority 이미지는 기존 동작(즉시 로드·페이드 없음)을 유지한다", () => {
    const src = "https://cdn.recipio.kr/priority.jpg";

    render(<Image src={src} priority alt="우선 이미지" />);

    const img = screen.getByAltText("우선 이미지");
    expect(img).toHaveAttribute("src", src);
    expect(img.parentElement).not.toHaveClass("transition-opacity");
  });
});
