import { render, screen } from "@testing-library/react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "./drawer";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    value: ResizeObserverMock,
  });
  Object.defineProperty(globalThis, "PointerEvent", {
    configurable: true,
    value: MouseEvent,
  });
});

it("공용 Drawer가 위치를 조정할 수 있는 닫기 버튼 하나를 소유합니다", () => {
  render(
    <Drawer defaultOpen>
      <DrawerContent closeLabel="닫기" closeButtonClassName="left-3 right-auto">
        <DrawerTitle>테스트 드로어</DrawerTitle>
        <DrawerDescription>테스트 설명</DrawerDescription>
      </DrawerContent>
    </Drawer>
  );

  const closeButton = screen.getByRole("button", { name: "닫기" });

  expect(closeButton).toHaveAttribute("data-slot", "drawer-close");
  expect(closeButton).toHaveClass("left-3", "right-auto");
  expect(screen.getAllByRole("button")).toHaveLength(1);
});
