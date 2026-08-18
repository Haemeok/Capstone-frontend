import { act, fireEvent, render, screen } from "@testing-library/react";

import { RecipeCookingRecordFlow } from "../RecipeCookingRecordFlow";

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => ({
  useResponsiveSheet: (() => {
    const Container = ({
      children,
      open,
    }: {
      children: React.ReactNode;
      open: boolean;
    }) => (open ? <div>{children}</div> : null);
    const Content = ({ children }: { children: React.ReactNode }) => (
      <section>{children}</section>
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
  rewardKicker: "이번 요리로 아꼈어요",
  rewardNext: "잠시 후 요리 기록으로 이어집니다",
  formTitle: "요리 기록 남기기",
  formDescription: "사진과 후기는 나중에도 바꿀 수 있어요.",
  photoLabel: "요리 사진",
  photoOptional: "선택",
  defaultPhoto: "기본 레시피 사진",
  addPhoto: "사진 추가",
  reviewLabel: "간단한 후기",
  reviewPlaceholder: "맛은 어땠는지 남겨보세요.",
  publishLabel: "레시피 후기로 공개",
  publishDescription: "레시피 상세에도 공개돼요.",
  skip: "건너뛰기",
  submit: "기록하기",
  submitting: "기록하는 중",
  successTitle: "요리 기록을 남겼어요",
  successDescription: "8월 기록에 추가됐습니다.",
  successClose: "닫기",
  error: "기록하지 못했습니다.",
};

it("금액 안내 다음에 선택 입력 폼을 보여주고 등록 완료까지 진행합니다", async () => {
  jest.useFakeTimers();
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  render(
    <RecipeCookingRecordFlow
      isOpen
      saveAmount={8400}
      recipeId="recipe-A"
      recipeTitle="동파육"
      recipeImageUrl="/dongpayuk.webp"
      copy={copy}
      onOpenChange={jest.fn()}
      onSubmit={onSubmit}
    />
  );

  const closeButton = screen.getByRole("button", { name: "닫기" });
  expect(screen.getByText("8,400원")).toBeInTheDocument();

  act(() => jest.advanceTimersByTime(2000));

  expect(
    screen.getByRole("heading", { name: "요리 기록 남기기" })
  ).toBeInTheDocument();
  expect(screen.getByAltText("동파육")).toHaveClass("h-[184px]", "w-[184px]");
  expect(screen.getByRole("button", { name: "닫기" })).toBe(closeButton);

  fireEvent.change(screen.getByLabelText("간단한 후기"), {
    target: { value: "맛있어요" },
  });
  fireEvent.click(screen.getByRole("button", { name: "기록하기" }));

  await screen.findByRole("heading", { name: "요리 기록을 남겼어요" });
  expect(onSubmit).toHaveBeenCalledWith({
    recipeId: "recipe-A",
    review: "맛있어요",
    isPublic: true,
    imageFile: undefined,
  });
  jest.useRealTimers();
});
