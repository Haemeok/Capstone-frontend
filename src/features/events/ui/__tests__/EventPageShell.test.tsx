import { render, screen } from "@testing-library/react";

import EventPageShell from "../EventPageShell";
import EventSection from "../EventSection";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: jest.fn() }),
  usePathname: () => "/",
}));

describe("EventPageShell", () => {
  it("헤더에 제목 텍스트를 렌더한다", () => {
    render(
      <EventPageShell
        title="여름 특가"
        heroSrc="/events/sample/hero.png"
        heroAlt="배너"
      >
        <div />
      </EventPageShell>
    );

    expect(screen.getByText("여름 특가")).toBeInTheDocument();
  });

  it("뒤로가기 컨트롤을 렌더한다", () => {
    render(
      <EventPageShell title="t" heroSrc="/x.png" heroAlt="a">
        <div />
      </EventPageShell>
    );

    expect(screen.getByLabelText("뒤로 가기")).toBeInTheDocument();
  });

  it("히어로를 순수 img로 src/alt와 함께 렌더한다", () => {
    render(
      <EventPageShell
        title="t"
        heroSrc="/events/sample/hero.png"
        heroAlt="여름 특가 배너"
      >
        <div />
      </EventPageShell>
    );

    const img = screen.getByRole("img", { name: "여름 특가 배너" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "/events/sample/hero.png");
  });

  it("custom hero를 기존 hero 자리에서 렌더링한다", () => {
    render(
      <EventPageShell
        title="앱"
        hero={<div data-testid="custom-hero">hero</div>}
      >
        <div />
      </EventPageShell>
    );
    expect(screen.getByTestId("custom-hero")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("null custom hero에서 이미지 fallback을 렌더링하지 않는다", () => {
    const { container } = render(
      <EventPageShell title="앱" hero={null}>
        <div />
      </EventPageShell>
    );

    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("undefined hero와 이미지 props가 함께 있으면 이미지를 렌더링한다", () => {
    render(
      <EventPageShell
        title="앱"
        hero={undefined}
        heroSrc="/events/sample/hero.png"
        heroAlt="앱 배너"
      >
        <div />
      </EventPageShell>
    );

    expect(screen.getByRole("img", { name: "앱 배너" })).toHaveAttribute(
      "src",
      "/events/sample/hero.png"
    );
  });

  it("콘텐츠 섹션을 작성 순서대로 렌더한다", () => {
    render(
      <EventPageShell title="t" heroSrc="/x.png" heroAlt="a">
        <EventSection title="EVENT 1">
          <span />
        </EventSection>
        <EventSection title="EVENT 2">
          <span />
        </EventSection>
      </EventPageShell>
    );

    const first = screen.getByText("EVENT 1");
    const second = screen.getByText("EVENT 2");
    expect(first).toBeInTheDocument();
    expect(second).toBeInTheDocument();
    expect(
      first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("props로 전달된 제목만 보여준다 (격리)", () => {
    const { unmount } = render(
      <EventPageShell title="여름" heroSrc="/a.png" heroAlt="a">
        <div />
      </EventPageShell>
    );
    expect(screen.getByText("여름")).toBeInTheDocument();
    expect(screen.queryByText("겨울")).not.toBeInTheDocument();
    unmount();

    render(
      <EventPageShell title="겨울" heroSrc="/b.png" heroAlt="b">
        <div />
      </EventPageShell>
    );
    expect(screen.getByText("겨울")).toBeInTheDocument();
    expect(screen.queryByText("여름")).not.toBeInTheDocument();
  });
});
