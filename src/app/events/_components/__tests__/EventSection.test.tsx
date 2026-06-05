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
});
