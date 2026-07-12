import { render, screen } from "@testing-library/react";

import type { CoupangProduct } from "../../model/types";
import { CoupangProductCard } from "../CoupangProductCard";

const base: CoupangProduct = {
  rank: 1,
  name: "한돈 앞다리살 전지 1kg",
  price: 12900,
  imageUrl: "https://img/1.jpg",
  url: "https://link.coupang.com/re/x",
  deliveryType: "ROCKET",
  freeShipping: false,
};

describe("CoupangProductCard", () => {
  it("로켓 상품: 이미지·상품명·가격·로켓 라벨·도착예정·단위가격 (T-01)", async () => {
    render(<CoupangProductCard product={base} />);

    expect(screen.getByText("한돈 앞다리살 전지 1kg")).toBeInTheDocument();
    expect(screen.getByText("12,900원")).toBeInTheDocument();
    expect(screen.getByTestId("rocket-badge")).toBeInTheDocument();
    expect(screen.getByText("100g당 1,290원")).toBeInTheDocument();
    expect(await screen.findByText(/도착 예정/)).toHaveClass("text-green-600");
  });

  it("링크는 url·새 탭 (T-02)", () => {
    render(<CoupangProductCard product={base} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", base.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("로켓프레시도 동일한 로켓 배지·도착 문구 (T-02)", async () => {
    render(
      <CoupangProductCard product={{ ...base, deliveryType: "ROCKET_FRESH" }} />
    );
    expect(screen.getByTestId("rocket-badge")).toBeInTheDocument();
    expect(await screen.findByText(/도착 예정/)).toBeInTheDocument();
  });

  it("일반배송: 로켓 배지·도착 문구 없음 (T-03)", () => {
    render(
      <CoupangProductCard product={{ ...base, deliveryType: "STANDARD" }} />
    );
    expect(screen.queryByTestId("rocket-badge")).not.toBeInTheDocument();
    expect(screen.queryByText(/도착 예정/)).not.toBeInTheDocument();
  });

  it("수량 토큰 없으면 단위가격 줄 없음 (T-26)", () => {
    render(<CoupangProductCard product={{ ...base, name: "국내산 대파" }} />);
    expect(screen.queryByText(/당 /)).not.toBeInTheDocument();
  });

  it("무료배송 상품은 카드에 무료배송 칩이 보인다 (T-07)", () => {
    render(<CoupangProductCard product={{ ...base, freeShipping: true }} />);
    expect(screen.getByText("무료배송")).toBeInTheDocument();
  });

  it("무료배송 아니면 칩 없음 (T-08)", () => {
    render(<CoupangProductCard product={base} />);
    expect(screen.queryByText("무료배송")).not.toBeInTheDocument();
  });
});
