import { type ReactNode } from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { CookingRecordBackgroundDrawer } from "../_components/CookingRecordBackgroundDrawer";
import { CookingRecordBoard } from "../_components/CookingRecordBoard";
import { CookingRecordDeleteDialog } from "../_components/CookingRecordDeleteDialog";
import { CookingRecordDetailDrawer } from "../_components/CookingRecordDetailDrawer";
import { CookingRecordHeader } from "../_components/CookingRecordHeader";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/shared/i18n/LocalizedLink", () => ({
  LocalizedLink: ({ children, href, ...props }: TestLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt, wrapperClassName, imgClassName }: TestImageProps) => (
    <span className={wrapperClassName}>
      <img src={src} alt={alt} className={imgClassName} />
    </span>
  ),
}));

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: () => ({
    isMobile: true,
    Container: ({ children, open }: TestContainerProps) =>
      open ? <div>{children}</div> : null,
    Content: ({ children, className }: TestPrimitiveProps) => (
      <section role="dialog" className={className}>
        {children}
      </section>
    ),
    Header: ({ children, className }: TestPrimitiveProps) => (
      <header className={className}>{children}</header>
    ),
    Title: ({ children, className }: TestPrimitiveProps) => (
      <h2 className={className}>{children}</h2>
    ),
    Description: ({ children, className }: TestPrimitiveProps) => (
      <p className={className}>{children}</p>
    ),
    Footer: ({ children, className }: TestPrimitiveProps) => (
      <footer className={className}>{children}</footer>
    ),
    Close: undefined,
  }),
}));

type TestPrimitiveProps = {
  children: ReactNode;
  className?: string;
};

type TestContainerProps = TestPrimitiveProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TestLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

type TestImageProps = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imgClassName?: string;
};

const detailCopy = {
  title: "요리 기록",
  closeLabel: "요리 기록 상세 닫기",
  moreLabel: "요리 기록 더보기",
  dishLabel: "이날의 요리",
  reviewLabel: "간략 후기",
  emptyReview: "아직 남긴 후기가 없습니다.",
  changePhoto: "사진 바꾸기",
  editReview: "후기 수정",
  saveReview: "후기 저장",
  viewRecipe: "실제 레시피 보러가기",
  deleteRecord: "이 기록 삭제",
};

const recordDetail = {
  id: "record-a8f",
  title: "동파육",
  cookedAtLabel: "8월 14일 · 저녁",
  imageUrl: "/records/dongporou.webp",
  imageAlt: "청경채를 곁들인 동파육",
  review:
    "청경채를 곁들여 느끼함 없이 먹었습니다. 오랜 시간 졸인 만큼 고기가 부드러웠습니다.",
  recipeHref: "/recipes/recipe-a8f",
};

describe("CookingRecordHeader", () => {
  it("페이지 제목과 월 선택을 다른 위계로 보여주고 월 이동과 배경 변경을 전달합니다", () => {
    const onPreviousMonth = jest.fn();
    const onNextMonth = jest.fn();
    const onOpenBackground = jest.fn();

    render(
      <CookingRecordHeader
        pageTitle="요리 기록"
        monthLabel="2026년 8월"
        monthCaption="이번 달"
        recordCountLabel="8개의 요리"
        backLabel="뒤로 가기"
        previousMonthLabel="이전 달"
        nextMonthLabel="다음 달"
        changeBackgroundLabel="배경 바꾸기"
        onBack={jest.fn()}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
        onOpenBackground={onOpenBackground}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "요리 기록" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "2026년 8월" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "이전 달" }));
    fireEvent.click(screen.getByRole("button", { name: "다음 달" }));
    fireEvent.click(screen.getByRole("button", { name: "배경 바꾸기" }));

    expect(onPreviousMonth).toHaveBeenCalledTimes(1);
    expect(onNextMonth).toHaveBeenCalledTimes(1);
    expect(onOpenBackground).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledTimes(3);
    expect(triggerHaptic).toHaveBeenCalledWith("Light");
  });
});

describe("CookingRecordBoard", () => {
  it("문자열 캡션 없이 이미지 스티커만 3열 캔버스에 표시합니다", () => {
    const onSelectRecord = jest.fn();
    const records = [
      {
        id: "record-1",
        title: "회",
        cookedAtLabel: "8월 2일 · 저녁",
        imageUrl: "/records/sashimi.webp",
        imageAlt: "접시에 담은 회",
      },
      {
        id: "record-2",
        title: "튀김덮밥",
        cookedAtLabel: "8월 5일 · 점심",
        imageUrl: "/records/tempura.webp",
        imageAlt: "튀김덮밥",
      },
      {
        id: "record-3",
        title: "가지튀김",
        cookedAtLabel: "8월 8일 · 저녁",
        imageUrl: "/records/eggplant.webp",
        imageAlt: "가지튀김",
      },
      {
        id: "record-4",
        title: "닭날개 구이",
        cookedAtLabel: "8월 11일 · 저녁",
        imageUrl: "/records/chicken.webp",
        imageAlt: "닭날개 구이",
      },
    ];

    render(
      <CookingRecordBoard
        ariaLabel="2026년 8월 요리 기록"
        records={records}
        background={{ kind: "dot" }}
        addRecordLabel="요리 기록 추가"
        getRecordLabel={(record) =>
          `${record.cookedAtLabel} ${record.title} 기록 보기`
        }
        onSelectRecord={onSelectRecord}
        onAddRecord={jest.fn()}
      />
    );

    const board = screen.getByRole("region", { name: "2026년 8월 요리 기록" });
    expect(within(board).getAllByRole("img")).toHaveLength(4);
    expect(within(board).queryByText("회")).not.toBeInTheDocument();
    expect(
      within(board).getByTestId("cooking-record-sticker-grid")
    ).toHaveClass("grid-cols-3");

    fireEvent.click(
      within(board).getByRole("button", { name: "8월 2일 · 저녁 회 기록 보기" })
    );
    expect(onSelectRecord).toHaveBeenCalledWith(records[0]);
    expect(triggerHaptic).toHaveBeenCalledWith("Light");
  });
});

describe("CookingRecordDetailDrawer", () => {
  const baseProps = {
    isOpen: true,
    detail: recordDetail,
    copy: detailCopy,
    contentStatus: "ready" as const,
    loadingLabel: "요리 기록을 불러오는 중",
    errorLabel: "요리 기록을 불러오지 못했습니다",
    retryLabel: "다시 시도",
    reviewDraft: recordDetail.review,
    isReviewSaving: false,
    isPhotoReplacing: false,
    onOpenChange: jest.fn(),
    onReviewDraftChange: jest.fn(),
    onStartReviewEdit: jest.fn(),
    onSaveReview: jest.fn(),
    onPhotoChange: jest.fn(),
    onDeleteRequest: jest.fn(),
    onRetry: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("보기 상태에서 사진 바꾸기와 후기 수정을 레시피 CTA 위에 배치합니다", () => {
    render(<CookingRecordDetailDrawer {...baseProps} mode="view" />);

    const changePhoto = screen.getByText("사진 바꾸기").closest("label");
    const editReview = screen.getByRole("button", { name: "후기 수정" });
    const recipeLink = screen.getByRole("link", {
      name: "실제 레시피 보러가기",
    });

    expect(changePhoto).toBeInTheDocument();
    expect(editReview.compareDocumentPosition(recipeLink)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(
      screen.getByRole("button", { name: "요리 기록 더보기" })
    ).toBeInTheDocument();
  });

  it("남긴 후기가 없으면 빈 상태 안내를 보여줍니다", () => {
    render(
      <CookingRecordDetailDrawer
        {...baseProps}
        detail={{ ...recordDetail, review: "" }}
        mode="view"
      />
    );

    expect(screen.getByText("아직 남긴 후기가 없습니다.")).toBeInTheDocument();
  });

  it("후기 수정 상태에서는 후기 입력과 저장만 남기고 다른 관리 행동을 숨깁니다", () => {
    const onSaveReview = jest.fn();
    render(
      <CookingRecordDetailDrawer
        {...baseProps}
        mode="review-edit"
        onSaveReview={onSaveReview}
      />
    );

    expect(screen.getByRole("textbox", { name: "간략 후기" })).toHaveValue(
      recordDetail.review
    );
    expect(
      screen.getByRole("button", { name: "후기 저장" })
    ).toBeInTheDocument();
    expect(screen.queryByText("사진 바꾸기")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "후기 수정" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "실제 레시피 보러가기" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "요리 기록 더보기" })
    ).not.toBeInTheDocument();

    const reviewForm = screen
      .getByRole("button", { name: "후기 저장" })
      .closest("form");
    expect(reviewForm).not.toBeNull();
    if (reviewForm) fireEvent.submit(reviewForm);
    expect(onSaveReview).toHaveBeenCalledWith(recordDetail.review);
  });

  it("상세 조회 중에는 관리 행동 대신 로딩 상태를 보여줍니다", () => {
    render(
      <CookingRecordDetailDrawer
        {...baseProps}
        contentStatus="loading"
        mode="view"
      />
    );

    expect(screen.getByText("요리 기록을 불러오는 중")).toBeInTheDocument();
    expect(screen.queryByText("사진 바꾸기")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "요리 기록 더보기" })
    ).not.toBeInTheDocument();
  });

  it("저장이나 사진 교체가 진행 중이면 중복 요청을 막습니다", () => {
    const { rerender } = render(
      <CookingRecordDetailDrawer
        {...baseProps}
        mode="review-edit"
        isReviewSaving
      />
    );

    expect(screen.getByRole("button", { name: "후기 저장" })).toBeDisabled();

    rerender(
      <CookingRecordDetailDrawer {...baseProps} mode="view" isPhotoReplacing />
    );
    expect(screen.getByLabelText("사진 바꾸기")).toBeDisabled();
  });
});

describe("CookingRecordBackgroundDrawer", () => {
  it("선택된 월 배경을 미리 보여주고 다른 배경 선택과 적용을 전달합니다", () => {
    const onSelectBackground = jest.fn();
    const onApply = jest.fn();

    render(
      <CookingRecordBackgroundDrawer
        isOpen
        monthLabel="2026년 8월"
        selectedBackground={{ kind: "dot" }}
        previewRecords={[
          {
            id: "record-1",
            title: "회",
            cookedAtLabel: "8월 2일 · 저녁",
            imageUrl: "/records/sashimi.webp",
            imageAlt: "접시에 담은 회",
          },
          {
            id: "record-2",
            title: "동파육",
            cookedAtLabel: "8월 14일 · 저녁",
            imageUrl: "/records/dongporou.webp",
            imageAlt: "청경채를 곁들인 동파육",
          },
        ]}
        copy={{
          title: "배경 바꾸기",
          closeLabel: "배경 바꾸기 닫기",
          monthOnlyLabel: "2026년 8월에만 적용됩니다",
          intro: "이번 달의 요리와 잘 어울리는 배경을 골라보세요.",
          previewLabel: "선택한 배경 미리보기",
          optionsTitle: "준비된 배경",
          optionsLabel: "준비된 배경 선택",
          optionLabels: {
            dot: "도트",
            linen: "리넨",
            tile: "타일",
            wood: "우드",
          },
          customBackground: "내 사진으로 배경 만들기",
          apply: "이 배경 적용",
        }}
        onOpenChange={jest.fn()}
        onSelectBackground={onSelectBackground}
        onCustomImageChange={jest.fn()}
        onApply={onApply}
      />
    );

    expect(screen.getByRole("button", { name: "도트" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    fireEvent.click(screen.getByRole("button", { name: "도트" }));
    expect(onSelectBackground).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "리넨" }));
    expect(onSelectBackground).toHaveBeenCalledWith({ kind: "linen" });
    expect(triggerHaptic).toHaveBeenCalledWith("Light");

    fireEvent.click(screen.getByRole("button", { name: "이 배경 적용" }));
    expect(onApply).toHaveBeenCalledTimes(1);
  });
});

describe("CookingRecordDeleteDialog", () => {
  it("삭제 결과를 단정하지 않고 취소와 삭제 의도를 callback으로 전달합니다", () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <CookingRecordDeleteDialog
        isOpen
        copy={{
          title: "이 기록을 삭제할까요?",
          description: "사진과 후기가 함께 삭제되며 되돌릴 수 없습니다.",
          cancel: "취소",
          confirm: "삭제",
        }}
        onOpenChange={jest.fn()}
        onCancel={onCancel}
        onConfirm={onConfirm}
        isPending={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("삭제 진행 중에는 취소와 삭제를 다시 누를 수 없습니다", () => {
    render(
      <CookingRecordDeleteDialog
        isOpen
        isPending
        copy={{
          title: "이 기록을 삭제할까요?",
          description: "사진과 후기가 함께 삭제되며 되돌릴 수 없습니다.",
          cancel: "취소",
          confirm: "삭제",
        }}
        onOpenChange={jest.fn()}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "취소" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "삭제" })).toBeDisabled();
  });
});
