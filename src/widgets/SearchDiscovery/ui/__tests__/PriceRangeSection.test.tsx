import { render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { PRICE_RANGES } from "@/entities/recipe/lib/content-pages";

import PriceRangeSection from "../PriceRangeSection";

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe("PriceRangeSection", () => {
  it("T-04: 네 가격대가 각각 전용 3D 이미지와 기존 가격 필터 URL을 사용한다", () => {
    render(<PriceRangeSection />);

    expect(PRICE_RANGES).toHaveLength(4);
    PRICE_RANGES.forEach((range) => {
      const link = screen.getByRole("link", { name: new RegExp(range.label) });
      const image = screen.getByRole("img", { name: range.label });

      expect(link).toHaveAttribute(
        "href",
        expect.stringContaining(
          range.maxCost
            ? `maxCost=${range.maxCost}`
            : `minCost=${range.minCost}`
        )
      );
      expect(image).toHaveAttribute("src", range.imageUrl);
      expect(range.imageUrl).toMatch(/^\/images\/search-price-range\/.+\.png$/);
      expect(existsSync(join(process.cwd(), "public", range.imageUrl))).toBe(
        true
      );
    });
  });
});
