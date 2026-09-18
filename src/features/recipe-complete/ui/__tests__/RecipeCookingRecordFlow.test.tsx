import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import type { RecordPhotoEditorProps } from "@/entities/recipe/model/recordPhoto.types";

import { RecipeCookingRecordFlow } from "../RecipeCookingRecordFlow";
import { RecipeCookingRecordForm } from "../RecipeCookingRecordForm";

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: (() => {
    const Container = ({
      children,
      open,
    }: {
      children: React.ReactNode;
      open: boolean;
    }) => (open ? <div>{children}</div> : null);
    const Content = ({
      children,
      className,
      closeLabel,
    }: {
      children: React.ReactNode;
      className?: string;
      closeLabel?: string;
    }) => (
      <section className={className}>
        {children}
        <button
          type="button"
          data-slot="dialog-close"
          aria-label={closeLabel ?? "Close"}
          className="absolute top-2.5 right-2.5 h-11 w-11"
        />
      </section>
    );
    const Title = ({ children }: { children: React.ReactNode }) => (
      <h2>{children}</h2>
    );
    const Description = ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    );
    return () => ({ Container, Content, Title, Description });
  })(),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    div: ({
      children,
      layout: _layout,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      layout?: boolean;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
    }) => <div {...props}>{children}</div>,
  },
}));
jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className="h-[184px] w-[184px]" />
  ),
}));

const copy = {
  close: "닫기",
  rewardTitle: "요리 완료",
  rewardKicker: "이번 요리로 절약했어요",
  rewardNext: "잠시 뒤 요리 기록으로 이어집니다",
  formTitle: "요리 기록 남기기",
  formDescription: "사진과 후기는 나중에도 바꿀 수 있어요.",
  photoLabel: "요리 사진",
  photoOptional: "선택",
  defaultPhoto: "기본 레시피 사진",
  addPhoto: "사진 추가",
  reviewLabel: "간단한 후기",
  reviewPlaceholder: "맛과 기억할 점을 남겨보세요",
  publishLabel: "후기 공개하기",
  publishDescription: "다른 사람도 이 레시피에서 내 후기를 볼 수 있어요.",
  skip: "건너뛰기",
  submit: "등록하기",
  submitting: "등록하는 중",
  successTitle: "요리 기록을 남겼어요",
  successDescription: "기록이 추가됐습니다.",
  successClose: "닫기",
  error: "등록하지 못했습니다.",
};

const IntegratedPhotoEditor = ({
  value,
  onChange,
  onBusyChange,
  fallbackImageUrl,
  fallbackImageAlt,
  requireUpload,
}: RecordPhotoEditorProps) => (
  <div>
    <span data-testid="photo-mode">{value.shape.kind}</span>
    <span data-testid="fallback-photo-url">{fallbackImageUrl}</span>
    <span data-testid="fallback-photo-alt">{fallbackImageAlt}</span>
    <span data-testid="requires-photo-upload">{String(requireUpload)}</span>
    <button
      type="button"
      onClick={() => {
        const file = new File(["dish"], "recipe-integrated.jpg", {
          type: "image/jpeg",
        });
        onChange({
          ...value,
          originalFile: file,
          originalUrl: "/recipe-integrated.jpg",
          plateId: "plate-2",
        });
      }}
    >
      실제 레시피 사진 선택
    </button>
    <button type="button" onClick={() => onBusyChange?.(true)}>
      레시피 사진 처리 시작
    </button>
  </div>
);

it("사진 필드 슬롯이 선택 파일을 레시피 기록 초안에 연결합니다", async () => {
  const onSubmit = jest.fn();
  const imageFile = new File(["image"], "recipe-dish.jpg", {
    type: "image/jpeg",
  });

  render(
    <RecipeCookingRecordForm
      recipeId="recipe-slot"
      recipeTitle="동파육"
      recipeImageUrl="/dongpayuk.webp"
      copy={copy}
      isSubmitting={false}
      photoField={({ file, onChange }) => (
        <button type="button" onClick={() => onChange(imageFile)}>
          {file?.name ?? "맞춤 사진 선택"}
        </button>
      )}
      onSubmit={onSubmit}
      onSkip={jest.fn()}
    />
  );

  fireEvent.click(screen.getByRole("button", { name: "맞춤 사진 선택" }));
  expect(
    screen.getByRole("button", { name: "recipe-dish.jpg" })
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: copy.submit }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({
      recipeId: "recipe-slot",
      review: "",
      isPublic: true,
      imageFile,
    })
  );
});

it("실제 사진 편집기의 접시 선택과 원본 파일을 레시피 기록 초안에 연결합니다", async () => {
  const onSubmit = jest.fn();

  render(
    <RecipeCookingRecordForm
      recipeId="recipe-integrated"
      recipeTitle="동파육"
      recipeImageUrl="/dongpayuk.webp"
      copy={copy}
      isSubmitting={false}
      photoEditor={IntegratedPhotoEditor}
      onSubmit={onSubmit}
      onSkip={jest.fn()}
    />
  );

  expect(screen.getByTestId("photo-mode")).toHaveTextContent("mask");
  expect(screen.getByTestId("fallback-photo-url")).toHaveTextContent(
    "/dongpayuk.webp"
  );
  expect(screen.getByTestId("fallback-photo-alt")).toHaveTextContent("동파육");
  expect(screen.getByTestId("requires-photo-upload")).toHaveTextContent("true");
  expect(screen.getByText(copy.defaultPhoto)).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "실제 레시피 사진 선택" })
  );
  expect(screen.queryByText(copy.defaultPhoto)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: copy.submit }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  const draft = onSubmit.mock.calls[0][0];
  expect(draft.photo).toEqual(
    expect.objectContaining({
      originalFile: draft.imageFile,
      shape: { kind: "mask", value: "CIRCLE" },
      plateId: "plate-2",
    })
  );
});

it("레시피 사진 처리 중에는 제출만 막고 후기와 건너뛰기는 유지합니다", () => {
  render(
    <RecipeCookingRecordForm
      recipeId="recipe-integrated"
      recipeTitle="동파육"
      recipeImageUrl="/dongpayuk.webp"
      copy={copy}
      isSubmitting={false}
      photoEditor={IntegratedPhotoEditor}
      onSubmit={jest.fn()}
      onSkip={jest.fn()}
    />
  );

  fireEvent.click(
    screen.getByRole("button", { name: "레시피 사진 처리 시작" })
  );

  expect(screen.getByRole("button", { name: copy.submit })).toBeDisabled();
  expect(screen.getByRole("button", { name: copy.submit })).toHaveClass(
    "text-white"
  );
  expect(screen.getByRole("button", { name: copy.submit })).not.toHaveClass(
    "text-ink"
  );
  expect(screen.getByLabelText(copy.reviewLabel)).not.toBeDisabled();
  expect(screen.getByRole("button", { name: copy.skip })).not.toBeDisabled();
});

const renderFlow = (
  onSubmit = jest.fn().mockResolvedValue(undefined),
  onSkip = jest.fn().mockResolvedValue(undefined),
  onOpenChange = jest.fn()
) =>
  render(
    <RecipeCookingRecordFlow
      isOpen
      saveAmount={8400}
      recipeId="recipe-A"
      recipeTitle="동파육"
      recipeImageUrl="/dongpayuk.webp"
      copy={copy}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      onSkip={onSkip}
    />
  );

const advanceToForm = () => {
  act(() => jest.advanceTimersByTime(2000));
};

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it("금액 안내 다음에 입력 폼을 보여주고 등록 완료까지 진행합니다", async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  renderFlow(onSubmit);

  const closeButton = screen.getByRole("button", { name: "닫기" });
  expect(screen.getByText("8,400원")).toBeInTheDocument();

  advanceToForm();

  expect(
    screen.getByRole("heading", { name: "요리 기록 남기기" })
  ).toBeInTheDocument();
  expect(screen.getByAltText("동파육")).toHaveClass("h-[184px]", "w-[184px]");
  expect(screen.getByRole("button", { name: "닫기" })).toBe(closeButton);

  fireEvent.change(screen.getByLabelText("간단한 후기"), {
    target: { value: "맛있어요" },
  });
  fireEvent.click(screen.getByRole("button", { name: "등록하기" }));

  await screen.findByRole("heading", { name: "요리 기록을 남겼어요" });
  expect(onSubmit).toHaveBeenCalledWith({
    recipeId: "recipe-A",
    review: "맛있어요",
    isPublic: true,
    imageFile: undefined,
  });
});

it("건너뛰기는 후기 등록 대신 완료 전용 작업 후 흐름을 닫습니다", async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  const onSkip = jest.fn().mockResolvedValue(undefined);
  const onOpenChange = jest.fn();
  renderFlow(onSubmit, onSkip, onOpenChange);
  advanceToForm();

  fireEvent.click(screen.getByRole("button", { name: copy.skip }));

  await act(async () => Promise.resolve());
  expect(onSkip).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it("T-09: 닫기 버튼을 우측에 두고 전체 wrapper의 큰 상단 여백을 제거합니다", () => {
  renderFlow();
  advanceToForm();

  const closeButton = screen.getByRole("button", { name: "닫기" });
  const phaseLayout = closeButton.parentElement?.firstElementChild;

  expect(closeButton).toHaveAttribute("data-slot", "dialog-close");
  expect(closeButton).toHaveClass("top-2.5", "right-2.5");
  expect(closeButton).not.toHaveClass("left-3");
  expect(screen.getAllByRole("button", { name: "닫기" })).toHaveLength(1);
  expect(phaseLayout).toHaveClass("flex", "min-h-0", "flex-1", "flex-col");
  expect(phaseLayout).not.toHaveClass("pt-16", "overflow-y-auto");
});

it("T-10: 사진과 후기 입력 본문에만 세로 스크롤을 적용합니다", () => {
  renderFlow();
  advanceToForm();

  const form = screen.getByRole("form", { name: "요리 기록 남기기" });
  const scrollRegion = within(form).getByTestId("cooking-record-scroll-region");

  expect(scrollRegion).toHaveClass("min-h-0", "flex-1", "overflow-y-auto");
});

it("T-11: 건너뛰기와 등록 버튼을 스크롤 영역 밖에 고정합니다", () => {
  renderFlow();
  advanceToForm();

  const form = screen.getByRole("form", { name: "요리 기록 남기기" });
  const actions = within(form).getByTestId("cooking-record-actions");
  const scrollRegion = within(form).getByTestId("cooking-record-scroll-region");

  expect(actions).toHaveClass("shrink-0");
  expect(actions).not.toHaveClass("sticky");
  expect(scrollRegion).not.toContainElement(
    within(actions).getByRole("button", { name: "등록하기" })
  );
});

it("T-12: 폼과 버튼 영역이 안전 영역을 포함한 flex 열 구조를 사용합니다", () => {
  renderFlow();
  advanceToForm();

  const form = screen.getByRole("form", { name: "요리 기록 남기기" });
  const actions = within(form).getByTestId("cooking-record-actions");

  expect(form).toHaveClass("flex", "min-h-0", "flex-1", "flex-col");
  expect(actions).toHaveClass(
    "border-t",
    "border-gray-100",
    "px-5",
    "pt-3",
    "pb-[max(16px,env(safe-area-inset-bottom))]"
  );
});
