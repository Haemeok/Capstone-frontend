import { render, screen } from "@testing-library/react";

import type { CoupangProduct } from "../../model/types";
import { CoupangProductSlide } from "../CoupangProductSlide";

const product = (name: string): CoupangProduct => ({
  rank: 1,
  name,
  price: 1000,
  imageUrl: "https://img",
  url: "https://link",
  categoryName: "식품",
  rocket: false,
  freeShipping: false,
});

describe("CoupangProductSlide", () => {
  it("카드마다 상품 렌더 (T-01)", () => {
    render(
      <CoupangProductSlide
        cards={[
          { product: product("대파 1단") },
          { product: product("계란 30구") },
        ]}
      />
    );
    expect(screen.getByText("대파 1단")).toBeInTheDocument();
    expect(screen.getByText("계란 30구")).toBeInTheDocument();
  });

  it("빈 cards면 렌더 안 함 (T-03)", () => {
    const { container } = render(<CoupangProductSlide cards={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
