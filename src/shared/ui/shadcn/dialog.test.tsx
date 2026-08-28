import { render, screen } from "@testing-library/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";

it("기본 닫기 버튼을 정확히 하나만 렌더링합니다", () => {
  render(
    <Dialog defaultOpen>
      <DialogContent>
        <DialogTitle>기본 모달</DialogTitle>
        <DialogDescription>기본 설명</DialogDescription>
      </DialogContent>
    </Dialog>
  );

  expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1);
});

it("닫기 버튼의 라벨과 위치만 화면에서 조정할 수 있습니다", () => {
  render(
    <Dialog defaultOpen>
      <DialogContent closeLabel="닫기" closeButtonClassName="left-3 right-auto">
        <DialogTitle>테스트 모달</DialogTitle>
        <DialogDescription>테스트 설명</DialogDescription>
      </DialogContent>
    </Dialog>
  );

  const closeButton = screen.getByRole("button", { name: "닫기" });

  expect(closeButton).toHaveAttribute("data-slot", "dialog-close");
  expect(closeButton).toHaveClass("left-3", "right-auto");
  expect(screen.getAllByRole("button")).toHaveLength(1);
});
