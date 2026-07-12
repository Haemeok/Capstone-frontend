import { render } from "@testing-library/react";

import { TabPanels } from "../ui/TabPanels";

const capturedOptions: Array<{ startIndex?: number }> = [];

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: (options: { startIndex?: number }) => {
    capturedOptions.push(options);
    return [jest.fn(), undefined];
  },
}));

const panels = [
  { id: "recipes", content: <div>recipes</div> },
  { id: "saved", content: <div>saved</div> },
  { id: "calendar", content: <div>calendar</div> },
];

beforeEach(() => {
  capturedOptions.length = 0;
});

test("T-01 activeIndex가 바뀌어도 embla 옵션 startIndex는 마운트 시점 값으로 고정된다 (옵션 변경 → reInit → 스냅 애니메이션 즉사 회귀 방지)", () => {
  const { rerender } = render(
    <TabPanels
      panels={panels}
      activeIndex={0}
      onActiveIndexChange={jest.fn()}
    />
  );
  rerender(
    <TabPanels
      panels={panels}
      activeIndex={1}
      onActiveIndexChange={jest.fn()}
    />
  );

  const startIndexes = new Set(capturedOptions.map((o) => o.startIndex));
  expect(startIndexes).toEqual(new Set([0]));
});

test("T-02 마운트 시점 activeIndex가 startIndex로 전달된다", () => {
  render(
    <TabPanels
      panels={panels}
      activeIndex={2}
      onActiveIndexChange={jest.fn()}
    />
  );

  expect(capturedOptions[0]?.startIndex).toBe(2);
});
