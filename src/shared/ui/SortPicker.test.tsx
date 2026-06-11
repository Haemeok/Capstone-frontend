import { useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import SortPicker from "./SortPicker";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const Harness = ({ triggerButton }: { triggerButton?: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SortPicker
      open={open}
      onOpenChange={setOpen}
      currentSort="최신순"
      availableSorts={["최신순", "오래된순"]}
      onSortChange={() => {}}
      triggerButton={triggerButton}
    />
  );
};

describe("SortPicker (데스크톱)", () => {
  it("triggerButton을 트리거로 렌더하고 클릭 시 정렬 옵션을 연다 (T-10)", () => {
    render(<Harness triggerButton={<button>정렬</button>} />);

    fireEvent.click(screen.getByRole("button", { name: "정렬" }));

    expect(screen.getByText("오래된순")).toBeInTheDocument();
  });

  it("triggerButton 없이 open이면 정렬 옵션을 렌더한다 (T-11, 카테고리 회귀)", () => {
    render(
      <SortPicker
        open={true}
        onOpenChange={() => {}}
        currentSort="최신순"
        availableSorts={["최신순", "오래된순"]}
        onSortChange={() => {}}
      />
    );

    expect(screen.getByText("오래된순")).toBeInTheDocument();
  });
});

describe("SortPicker (모바일)", () => {
  it("모바일에서도 triggerButton을 렌더한다 (버튼 사라짐 회귀 방지)", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    render(
      <SortPicker
        open={false}
        onOpenChange={() => {}}
        currentSort="최신순"
        availableSorts={["최신순", "오래된순"]}
        onSortChange={() => {}}
        triggerButton={<button>정렬</button>}
      />
    );

    expect(screen.getByRole("button", { name: "정렬" })).toBeInTheDocument();
  });
});
