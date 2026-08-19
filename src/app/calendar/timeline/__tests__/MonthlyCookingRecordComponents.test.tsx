import { type ReactNode } from "react";

import { fireEvent, render, screen, within } from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { CookingRecordBoard } from "../_components/CookingRecordBoard";
import { CookingRecordDeleteDialog } from "../_components/CookingRecordDeleteDialog";
import { CookingRecordDetailDrawer } from "../_components/CookingRecordDetailDrawer";
import { CookingRecordHeader } from "../_components/CookingRecordHeader";
import { CookingRecordViewSettingsDrawer } from "../_components/CookingRecordViewSettingsDrawer";
import styles from "../_components/MonthlyCookingRecord.module.css";

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/shared/i18n/LocalizedLink", () => ({
  LocalizedLink: ({ children, href, ...props }: TestLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({
    src,
    alt,
    wrapperClassName,
    imgClassName,
    skeleton,
    errorFallback,
    onLoad,
  }: TestImageProps) => (
    <span className={wrapperClassName}>
      {skeleton ? <span data-testid="image-skeleton">{skeleton}</span> : null}
      {errorFallback ? (
        <span data-testid="image-error-fallback">{errorFallback}</span>
      ) : null}
      <img src={src} alt={alt} className={imgClassName} onLoad={onLoad} />
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
  skeleton?: ReactNode;
  errorFallback?: ReactNode;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
};

const detailCopy = {
  title: "요리 기록",
  closeLabel: "요리 기록 상세 닫기",
  moreLabel: "요리 기록 더보기",
  dishLabel: "이날의 요리",
  dishNameLabel: "요리 이름",
  reviewLabel: "간략 후기",
  titleRequiredError: "요리 이름을 입력해 주세요.",
  titleTooLongError: "요리 이름은 30자까지 입력할 수 있어요.",
  reviewTooLongError: "후기는 500자까지 입력할 수 있어요.",
  saveError: "요리 기록을 수정하지 못했어요. 다시 시도해 주세요.",
  emptyReview: "아직 남긴 후기가 없습니다.",
  changePhoto: "사진 바꾸기",
  editRecord: "기록 수정",
  saveRecord: "수정 내용 저장",
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
  it("페이지 제목과 월 선택을 다른 위계로 보여주고 월 이동과 보기 설정을 전달합니다", () => {
    const onPreviousMonth = jest.fn();
    const onNextMonth = jest.fn();
    const onOpenSettings = jest.fn();

    render(
      <CookingRecordHeader
        pageTitle="요리 기록"
        monthLabel="2026년 8월"
        monthCaption="이번 달"
        backLabel="뒤로 가기"
        previousMonthLabel="이전 달"
        nextMonthLabel="다음 달"
        settingsLabel="요리 기록 보기 설정"
        settingsShortLabel="설정"
        onBack={jest.fn()}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
        onOpenSettings={onOpenSettings}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "요리 기록" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "2026년 8월" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "요리 기록 보기 설정" })
    ).toHaveTextContent("설정");
    expect(
      screen.getByRole("navigation", {
        name: "2026년 8월 이전 달 다음 달",
      })
    ).toHaveClass("grid-cols-[64px_minmax(0,1fr)_64px]");
    expect(screen.queryByText("8개의 요리")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "이전 달" }));
    fireEvent.click(screen.getByRole("button", { name: "다음 달" }));
    fireEvent.click(
      screen.getByRole("button", { name: "요리 기록 보기 설정" })
    );

    expect(onPreviousMonth).toHaveBeenCalledTimes(1);
    expect(onNextMonth).toHaveBeenCalledTimes(1);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledTimes(3);
    expect(triggerHaptic).toHaveBeenCalledWith("Light");
  });
});

describe("CookingRecordBoard", () => {
  it("요리 개수와 이름 라벨을 배경 위 4열 스티커북에 표시합니다", () => {
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
        title: "야식으로 먹은 닭날개 구이",
        cookedAtLabel: "8월 11일 · 저녁",
        imageUrl: "/records/chicken.webp",
        imageAlt: "닭날개 구이",
      },
    ];

    render(
      <CookingRecordBoard
        ariaLabel="2026년 8월 요리 기록"
        records={records}
        background={{
          backgroundKey: "DEFAULT",
          backgroundType: "PRESET",
          imageUrl: null,
        }}
        recordCountLabel="4개의 요리"
        addRecordLabel="요리 기록 추가"
        shareRecordLabel="8월 요리 기록 공유"
        getRecordLabel={(record) =>
          `${record.cookedAtLabel} ${record.title} 기록 보기`
        }
        onSelectRecord={onSelectRecord}
        onAddRecord={jest.fn()}
        onShareRecord={jest.fn()}
      />
    );

    const board = screen.getByRole("region", { name: "2026년 8월 요리 기록" });
    expect(within(board).getAllByRole("img")).toHaveLength(4);
    expect(within(board).getByText("회")).toHaveClass(
      "truncate",
      "rounded-full",
      "bg-white"
    );
    expect(within(board).getByText("야식으로 먹은 닭날개 구이")).toHaveClass(
      "truncate"
    );
    expect(
      within(board).getByTestId("cooking-record-sticker-grid")
    ).toHaveClass("grid-cols-4");
    expect(within(board).getByText("4개의 요리")).toHaveClass(
      "bg-white/85",
      "shadow-sm"
    );
    expect(
      within(board).getByTestId("cooking-record-bottom-actions")
    ).toHaveClass("fixed", "bottom-[var(--bottom-nav-h)]", "md:bottom-0");
    expect(
      within(board).getByRole("button", { name: "요리 기록 추가" })
    ).toHaveClass("bg-olive-light");
    expect(
      within(board).getByRole("button", { name: "8월 요리 기록 공유" })
    ).toBeInTheDocument();

    fireEvent.click(
      within(board).getByRole("button", { name: "8월 2일 · 저녁 회 기록 보기" })
    );
    expect(onSelectRecord).toHaveBeenCalledWith(records[0]);
    expect(triggerHaptic).toHaveBeenCalledWith("Light");
  });

  it("서버 배경을 기록 그리드를 밀지 않는 전용 레이어에 표시합니다", () => {
    render(
      <CookingRecordBoard
        ariaLabel="요리 기록"
        records={[]}
        background={{
          backgroundKey: "WOOD",
          backgroundType: "PRESET",
          imageUrl: "/backgrounds/wood.webp",
        }}
        recordCountLabel="0개의 요리"
        addRecordLabel="요리 기록 추가"
        shareRecordLabel="요리 기록 공유"
        getRecordLabel={() => "요리 기록 보기"}
        onSelectRecord={jest.fn()}
        onAddRecord={jest.fn()}
        onShareRecord={jest.fn()}
      />
    );

    const board = screen.getByRole("region", { name: "요리 기록" });
    const backgroundLayer = within(board).getByTestId(
      "cooking-record-background-layer"
    );

    expect(board).not.toHaveClass(styles.dot);
    expect(backgroundLayer).toHaveClass(
      "pointer-events-none",
      "absolute",
      "inset-0"
    );
    expect(within(backgroundLayer).getByRole("presentation")).toHaveAttribute(
      "src",
      "/backgrounds/wood.webp"
    );
    expect(within(backgroundLayer).getByRole("presentation")).toHaveClass(
      "object-top"
    );
  });

  it("누끼 이미지가 준비되면 원본 위로 자연스럽게 교차 전환합니다", () => {
    const baseRecord = {
      id: "record-processing",
      title: "계란말이",
      cookedAtLabel: "8월 18일",
      imageUrl: "/records/original.webp",
      imageAlt: "계란말이",
    };
    const boardProps = {
      ariaLabel: "요리 기록",
      background: {
        backgroundKey: "DEFAULT",
        backgroundType: "PRESET" as const,
        imageUrl: null,
      },
      recordCountLabel: "1개의 요리",
      addRecordLabel: "요리 기록 추가",
      shareRecordLabel: "요리 기록 공유",
      getRecordLabel: () => "계란말이 기록 보기",
      onSelectRecord: jest.fn(),
      onAddRecord: jest.fn(),
      onShareRecord: jest.fn(),
    };
    const { rerender } = render(
      <CookingRecordBoard {...boardProps} records={[baseRecord]} />
    );

    rerender(
      <CookingRecordBoard
        {...boardProps}
        records={[{ ...baseRecord, imageUrl: "/records/sticker.webp" }]}
      />
    );

    const incoming = screen.getByTestId("cooking-record-incoming-image");
    expect(screen.getAllByAltText("계란말이")).toHaveLength(2);
    expect(incoming).toHaveClass(
      "opacity-0",
      "transition-opacity",
      "duration-200"
    );

    fireEvent.load(within(incoming).getByAltText("계란말이"));
    expect(incoming).toHaveClass("opacity-100");

    fireEvent.transitionEnd(incoming);
    expect(screen.getAllByAltText("계란말이")).toHaveLength(1);
    expect(screen.getByAltText("계란말이")).toHaveAttribute(
      "src",
      "/records/sticker.webp"
    );
  });

  it("서버 배경을 불러오는 중이거나 실패하면 도트 배경만 표시합니다", () => {
    render(
      <CookingRecordBoard
        ariaLabel="요리 기록"
        records={[]}
        background={{
          backgroundKey: "WOOD",
          backgroundType: "PRESET",
          imageUrl: "/backgrounds/wood.webp",
        }}
        recordCountLabel="0개의 요리"
        addRecordLabel="요리 기록 추가"
        shareRecordLabel="요리 기록 공유"
        getRecordLabel={() => "요리 기록 보기"}
        onSelectRecord={jest.fn()}
        onAddRecord={jest.fn()}
        onShareRecord={jest.fn()}
      />
    );

    const backgroundLayer = screen.getByTestId(
      "cooking-record-background-layer"
    );
    const skeleton = within(backgroundLayer).getByTestId("image-skeleton");
    const errorFallback = within(backgroundLayer).getByTestId(
      "image-error-fallback"
    );

    expect(skeleton.firstElementChild).toHaveClass(styles.dot);
    expect(errorFallback.firstElementChild).toHaveClass(styles.dot);
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
    isReviewSaving: false,
    isPhotoReplacing: false,
    onOpenChange: jest.fn(),
    onStartEdit: jest.fn(),
    onSaveRecord: jest.fn().mockResolvedValue(true),
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
    const editRecord = screen.getByRole("button", { name: "기록 수정" });
    const recipeLink = screen.getByRole("link", {
      name: "실제 레시피 보러가기",
    });

    expect(changePhoto).toBeInTheDocument();
    expect(editRecord.compareDocumentPosition(recipeLink)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    const scrollArea = screen.getByTestId("cooking-record-detail-scroll");
    const actions = screen.getByTestId("cooking-record-detail-actions");
    expect(scrollArea).not.toContainElement(recipeLink);
    expect(actions).toContainElement(changePhoto);
    expect(actions).toContainElement(editRecord);
    expect(actions).toContainElement(recipeLink);
    expect(actions).toHaveClass("shrink-0");
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

  it("기록 수정 상태에서는 제목과 후기 입력 및 저장만 남기고 다른 관리 행동을 숨깁니다", () => {
    const onSaveRecord = jest.fn().mockResolvedValue(true);
    render(
      <CookingRecordDetailDrawer
        {...baseProps}
        mode="edit"
        onSaveRecord={onSaveRecord}
      />
    );

    expect(screen.getByRole("textbox", { name: "요리 이름" })).toHaveValue(
      recordDetail.title
    );
    expect(screen.getByRole("textbox", { name: "간략 후기" })).toHaveValue(
      recordDetail.review
    );
    expect(
      screen.getByRole("button", { name: "수정 내용 저장" })
    ).toBeInTheDocument();
    expect(screen.queryByText("사진 바꾸기")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "기록 수정" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "실제 레시피 보러가기" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "요리 기록 더보기" })
    ).not.toBeInTheDocument();

    const reviewFormId = screen
      .getByRole("button", { name: "수정 내용 저장" })
      .getAttribute("form");
    const reviewForm = reviewFormId
      ? document.getElementById(reviewFormId)
      : null;
    expect(reviewForm).not.toBeNull();
    if (reviewForm) fireEvent.submit(reviewForm);
    expect(onSaveRecord).toHaveBeenCalledWith({
      title: recordDetail.title,
      review: recordDetail.review,
    });
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
      <CookingRecordDetailDrawer {...baseProps} mode="edit" isReviewSaving />
    );

    expect(
      screen.getByRole("button", { name: "수정 내용 저장" })
    ).toBeDisabled();

    rerender(
      <CookingRecordDetailDrawer {...baseProps} mode="view" isPhotoReplacing />
    );
    expect(screen.getByLabelText("사진 바꾸기")).toBeDisabled();
  });
});

describe("CookingRecordViewSettingsDrawer", () => {
  it("요리 이름 표시를 바꾸고 서버가 제공한 전역 배경 선택과 적용을 전달합니다", () => {
    const onSelectBackground = jest.fn();
    const onApply = jest.fn();
    const onRecordNameVisibilityChange = jest.fn();

    render(
      <CookingRecordViewSettingsDrawer
        isOpen
        isRecordNameVisible
        backgrounds={[
          {
            backgroundKey: "DEFAULT",
            backgroundType: "PRESET",
            imageUrl: null,
            selected: false,
          },
          {
            backgroundKey: "PAPER_BEIGE",
            backgroundType: "PRESET",
            imageUrl: "/backgrounds/paper-beige.webp",
            selected: true,
          },
        ]}
        previewBackground={{
          backgroundKey: "PAPER_BEIGE",
          backgroundType: "PRESET",
          imageUrl: "/backgrounds/paper-beige.webp",
        }}
        selectedBackgroundKey="PAPER_BEIGE"
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
          title: "보기 설정",
          closeLabel: "보기 설정 닫기",
          description: "이름 표시와 배경을 바꿀 수 있어요.",
          showRecordNamesLabel: "요리 이름 표시",
          showRecordNamesDescription: "사진에 요리 이름을 표시해요.",
          intro: "배경은 모든 달의 요리 기록에 함께 적용돼요.",
          previewLabel: "선택한 배경 미리보기",
          customTitle: "내 배경",
          customOptionsLabel: "내 배경 선택",
          addCustom: "사진 추가",
          customLimit: "내 배경 {count}/20",
          addingCustom: "배경을 추가하는 중",
          processingCustom: "사진을 처리하는 중",
          retryCustom: "등록 다시 시도",
          deleteCustom: "이 배경 삭제",
          customErrors: {
            EMPTY_FILE: "빈 파일입니다.",
            UNSUPPORTED_TYPE: "지원하지 않는 형식입니다.",
            FILE_TOO_LARGE: "파일이 너무 큽니다.",
            RESELECT_FILE: "사진을 다시 선택해 주세요.",
            LIMIT_REACHED: "20개까지 추가할 수 있습니다.",
            PROCESSING_TIMEOUT: "사진 처리가 늦어지고 있습니다.",
            UPLOAD_FAILED: "추가하지 못했습니다.",
          },
          optionsTitle: "준비된 배경",
          optionsLabel: "준비된 배경 선택",
          optionLabel: "배경 {index}",
          loading: "배경을 불러오는 중",
          error: "배경을 불러오지 못했습니다",
          retry: "다시 시도",
          apply: "이 배경 적용",
          applying: "적용 중",
        }}
        isListPending={false}
        isListError={false}
        isAddingCustom={false}
        isCustomBackgroundProcessing={false}
        isApplying={false}
        onOpenChange={jest.fn()}
        onRecordNameVisibilityChange={onRecordNameVisibilityChange}
        onSelectBackground={onSelectBackground}
        onAddCustomBackground={jest.fn()}
        onRetryCustomBackground={jest.fn()}
        onRequestDeleteCustomBackground={jest.fn()}
        onRetry={jest.fn()}
        onApply={onApply}
      />
    );

    expect(screen.getByRole("button", { name: "배경 2" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    const nameToggle = screen.getByRole("switch", {
      name: "요리 이름 표시",
    });
    expect(nameToggle).toHaveAttribute("aria-checked", "true");
    fireEvent.click(nameToggle);
    expect(onRecordNameVisibilityChange).toHaveBeenCalledWith(false);
    expect(triggerHaptic).toHaveBeenCalledWith("Light");
    expect(
      within(screen.getByLabelText("선택한 배경 미리보기")).getByRole(
        "presentation"
      )
    ).toHaveClass("object-top");
    fireEvent.click(screen.getByRole("button", { name: "배경 2" }));
    expect(onSelectBackground).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "배경 1" }));
    expect(onSelectBackground).toHaveBeenCalledWith("DEFAULT");
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
