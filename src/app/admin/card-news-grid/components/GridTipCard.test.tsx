import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { GridTipCard } from "./GridTipCard";

const items = Array.from({ length: 9 }, (_, i) => ({
  dishName: `음식${i}`,
  caption: `팁${i}`,
}));

describe("GridTipCard", () => {
  it("헤더/푸터 문구를 렌더한다", () => {
    render(<GridTipCard header="토마토케찹 황금비율 Best 9" imageUrl="data:image/png;base64,AAAA" items={items} />);
    expect(screen.getByText("토마토케찹 황금비율 Best 9")).toBeInTheDocument();
    expect(screen.getByText("캡처해두고 사용하세요!")).toBeInTheDocument();
  });

  it("9개 음식 이름과 캡션을 모두 렌더한다", () => {
    render(<GridTipCard header="h" imageUrl="data:image/png;base64,AAAA" items={items} />);
    items.forEach((it) => {
      expect(screen.getByText(it.dishName)).toBeInTheDocument();
      expect(screen.getByText(it.caption)).toBeInTheDocument();
    });
  });

  it("ref가 카드 루트 엘리먼트를 가리킨다", () => {
    const ref = createRef<HTMLDivElement>();
    render(<GridTipCard ref={ref} header="h" imageUrl="data:image/png;base64,AAAA" items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("긴 캡션은 truncate되어 렌더된다", () => {
    const longItems = items.map((it, i) =>
      i === 0 ? { ...it, caption: "가".repeat(60) } : it,
    );
    render(<GridTipCard header="h" imageUrl="data:image/png;base64,AAAA" items={longItems} />);
    expect(screen.queryByText("가".repeat(60))).not.toBeInTheDocument();
    expect(screen.getByText(/…$/)).toBeInTheDocument();
  });
});
