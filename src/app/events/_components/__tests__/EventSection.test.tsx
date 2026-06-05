import { render, screen } from "@testing-library/react";

import EventSection from "../EventSection";

describe("EventSection", () => {
  it("제목과 본문을 렌더한다", () => {
    render(
      <EventSection title="EVENT 1">
        <p>내용</p>
      </EventSection>
    );

    expect(screen.getByText("EVENT 1")).toBeInTheDocument();
    expect(screen.getByText("내용")).toBeInTheDocument();
  });

  it("label을 전달하면 eyebrow로 렌더한다", () => {
    render(
      <EventSection title="제목" label="EVENT 1">
        <p>내용</p>
      </EventSection>
    );

    expect(screen.getByText("EVENT 1")).toBeInTheDocument();
    expect(screen.getByText("제목")).toBeInTheDocument();
  });
});
