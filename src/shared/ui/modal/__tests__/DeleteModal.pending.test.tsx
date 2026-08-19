import { render, screen } from "@testing-library/react";

import { DeleteModal } from "../DeleteModal";

jest.mock("@/shared/i18n", () => ({
  useCommonDict: () => ({
    modal: {
      delete: {
        description: "삭제하면 복구할 수 없습니다.",
        cancel: "취소",
        confirm: "삭제",
      },
    },
  }),
}));

it("삭제 중에는 취소와 확인을 잠그고 진행 문구를 표시합니다", () => {
  render(
    <DeleteModal
      open
      isPending
      pendingLabel="삭제하는 중"
      onOpenChange={() => {}}
      title="삭제"
      onConfirm={() => {}}
    />
  );

  expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "삭제하는 중" })).toBeDisabled();
});
