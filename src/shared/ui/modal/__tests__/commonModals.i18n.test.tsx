import { render } from "@testing-library/react";

import { commonMessages } from "@/shared/i18n/commonMessages";

let mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import { DeleteModal } from "../DeleteModal";
import { UnsavedChangesModal } from "../UnsavedChangesModal";

const jaModal = commonMessages.ja.modal;
const enModal = commonMessages.en.modal;

describe("공통 모달 i18n", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("ja DeleteModal이 라벨 prop 없이 현지 기본값을 쓴다 (T-08)", () => {
    mockPathname = "/ja";
    render(
      <DeleteModal
        open
        onOpenChange={() => {}}
        title="削除"
        description="削除すると元に戻せません。"
        onConfirm={() => {}}
      />
    );
    expect(document.body.textContent).toContain(jaModal.delete.cancel);
    expect(document.body.textContent).toContain(jaModal.delete.confirm);
  });

  it("en DeleteModal description 기본값이 영어다 (T-08)", () => {
    mockPathname = "/en";
    render(
      <DeleteModal
        open
        onOpenChange={() => {}}
        title="Delete"
        onConfirm={() => {}}
      />
    );
    expect(document.body.textContent).toContain(enModal.delete.description);
  });

  it("명시적 confirmLabel prop이 현지 기본값을 덮는다 (T-09)", () => {
    mockPathname = "/ja";
    render(
      <DeleteModal
        open
        onOpenChange={() => {}}
        title="削除"
        onConfirm={() => {}}
        confirmLabel="完全に削除"
      />
    );
    expect(document.body.textContent).toContain("完全に削除");
  });

  it("ja UnsavedChangesModal 4문구가 일본어다 (T-10)", () => {
    mockPathname = "/ja";
    render(
      <UnsavedChangesModal open onOpenChange={() => {}} onConfirm={() => {}} />
    );
    const text = document.body.textContent ?? "";
    expect(text).toContain(jaModal.unsavedChanges.title);
    expect(text).toContain(jaModal.unsavedChanges.description);
    expect(text).toContain(jaModal.unsavedChanges.cancel);
    expect(text).toContain(jaModal.unsavedChanges.leave);
  });

  it("ko 루트에서 두 모달이 기존 한국어로 불변이다 (T-11)", () => {
    mockPathname = "/";
    const { rerender } = render(
      <DeleteModal
        open
        onOpenChange={() => {}}
        title="삭제"
        onConfirm={() => {}}
      />
    );
    expect(document.body.textContent).toContain("삭제 시 복구할 수 없습니다.");

    rerender(
      <UnsavedChangesModal open onOpenChange={() => {}} onConfirm={() => {}} />
    );
    const text = document.body.textContent ?? "";
    expect(text).toContain("저장하지 않고 나가시겠어요?");
    expect(text).toContain("나가기");
  });
});
