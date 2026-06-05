import { render, screen } from "@testing-library/react";

import EventFAQ from "../EventFAQ";

describe("EventFAQ", () => {
  it("전달된 질문과 답변을 모두 렌더한다", () => {
    render(
      <EventFAQ
        items={[
          { question: "환불 되나요?", answer: "7일 내 가능합니다." },
          { question: "배송 기간은?", answer: "2~3일 걸립니다." },
        ]}
      />
    );

    expect(screen.getByText("환불 되나요?")).toBeInTheDocument();
    expect(screen.getByText("7일 내 가능합니다.")).toBeInTheDocument();
    expect(screen.getByText("배송 기간은?")).toBeInTheDocument();
    expect(screen.getByText("2~3일 걸립니다.")).toBeInTheDocument();
  });
});
