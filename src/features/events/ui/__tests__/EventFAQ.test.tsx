import { fireEvent, render, screen } from "@testing-library/react";

import EventFAQ from "../EventFAQ";

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const items = [
  { question: "환불 되나요?", answer: "7일 내 가능합니다." },
  { question: "배송 기간은?", answer: "2~3일 걸립니다." },
];

describe("EventFAQ", () => {
  it("전달된 질문을 모두 렌더한다", () => {
    render(<EventFAQ heading="자주 묻는 질문" items={items} />);

    expect(screen.getByText("환불 되나요?")).toBeInTheDocument();
    expect(screen.getByText("배송 기간은?")).toBeInTheDocument();
  });

  it("질문을 클릭하면 답변이 펼쳐진다", async () => {
    render(<EventFAQ heading="자주 묻는 질문" items={items} />);
    expect(screen.queryByText("7일 내 가능합니다.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("환불 되나요?"));

    expect(await screen.findByText("7일 내 가능합니다.")).toBeInTheDocument();
  });
});
