import { useState } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { ManualCookingRecordDrawer } from "../ManualCookingRecordDrawer";

const createRecord = jest.fn();
const mockedTriggerHaptic = jest.mocked(triggerHaptic);
const mutationState = {
  createRecord,
  reset: jest.fn(),
  isPending: false,
  isImageProcessing: false,
};

jest.mock("../../model/hooks", () => ({
  useCreateManualCookingRecord: () => mutationState,
}));
jest.mock("@/shared/hooks/useImagePreview", () => ({
  useImagePreview: (value?: File) => (value ? "/preview.webp" : null),
}));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => {
  const Container = ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => <div data-state={open ? "open" : "closed"}>{children}</div>;
  const Content = ({ children }: { children: React.ReactNode }) => (
    <section>{children}</section>
  );
  const Title = ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  );
  const Description = ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  );

  return {
    useResponsiveSheet: () => ({ Container, Content, Title, Description }),
  };
});
jest.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    div: ({
      children,
      className,
      "data-testid": testId,
    }: {
      children: React.ReactNode;
      className?: string;
      "data-testid"?: string;
    }) => (
      <div className={className} data-testid={testId}>
        {children}
      </div>
    ),
  },
}));
jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

beforeEach(() => {
  createRecord.mockReset();
  mutationState.reset.mockReset();
  mutationState.isPending = false;
  mutationState.isImageProcessing = false;
  mockedTriggerHaptic.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

const copy = {
  title: "요리 기록 추가",
  closeLabel: "요리 기록 추가 닫기",
  description: "직접 만든 요리를 남겨보세요.",
  photoLabel: "요리 사진",
  photoRequired: "필수",
  addPhoto: "사진 추가",
  dishTitleLabel: "요리 이름",
  dishTitlePlaceholder: "어떤 요리를 만들었나요?",
  cookedDateLabel: "요리한 날짜",
  reviewLabel: "간단한 후기",
  reviewOptional: "선택",
  reviewPlaceholder: "맛은 어땠는지 남겨보세요.",
  submit: "기록하기",
  submitting: "기록하는 중",
  processing: "사진 처리 중",
  processingTitle: "요리 사진을 처리하고 있어요",
  processingDescription: "완료되면 자동으로 기록됩니다.",
  successTitle: "요리 기록을 남겼어요",
  successDescription: "이번 달 기록에 추가됐습니다.",
  successClose: "닫기",
  photoError: "요리 사진을 추가해 주세요.",
  titleError: "요리 이름을 입력해 주세요.",
  submitError: "기록하지 못했습니다.",
};

it("807 자동 재요청 중에는 이미지 처리 안내를 보여주고 입력을 잠급니다", () => {
  mutationState.isPending = true;
  mutationState.isImageProcessing = true;

  render(
    <ManualCookingRecordDrawer isOpen copy={copy} onOpenChange={jest.fn()} />
  );

  expect(screen.getByRole("status")).toHaveTextContent(
    "요리 사진을 처리하고 있어요"
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "완료되면 자동으로 기록됩니다."
  );
  expect(screen.getByLabelText("요리 사진")).toBeDisabled();
  expect(screen.getByLabelText("요리 이름")).toBeDisabled();
  expect(screen.getByRole("button", { name: "사진 처리 중" })).toBeDisabled();
});

it("닫기는 우측에 두고 사진은 가운데 정렬하며 제출 버튼은 스크롤 밖에 고정합니다", () => {
  const onOpenChange = jest.fn();
  render(
    <ManualCookingRecordDrawer isOpen copy={copy} onOpenChange={onOpenChange} />
  );

  const closeButton = screen.getByRole("button", {
    name: "요리 기록 추가 닫기",
  });
  expect(closeButton).toHaveClass("right-3");
  expect(screen.getByText("사진 추가").closest("label")).toHaveClass("mx-auto");

  const scrollArea = screen.getByTestId("manual-cooking-record-scroll");
  const submitButton = screen.getByRole("button", { name: "기록하기" });
  expect(scrollArea).not.toContainElement(submitButton);
  expect(submitButton.parentElement).toHaveClass("shrink-0");
  expect(submitButton).toHaveClass(
    "bg-olive-light",
    "active:bg-olive-dark",
    "focus-visible:outline-olive-dark"
  );
  expect(submitButton).not.toHaveClass("bg-ink");

  fireEvent.click(closeButton);
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(mockedTriggerHaptic).not.toHaveBeenCalled();
});

it("수동 기록은 이름과 사진을 받아 기존 MANUAL 생성 훅으로 전달합니다", async () => {
  createRecord.mockResolvedValue({ recordId: "record-A" });
  render(
    <ManualCookingRecordDrawer isOpen copy={copy} onOpenChange={jest.fn()} />
  );
  const imageFile = new File(["image"], "dish.jpg", { type: "image/jpeg" });

  fireEvent.change(screen.getByLabelText("요리 사진"), {
    target: { files: [imageFile] },
  });
  fireEvent.change(screen.getByLabelText("요리 이름"), {
    target: { value: "야식 볶음밥" },
  });
  fireEvent.change(screen.getByLabelText("요리한 날짜"), {
    target: { value: "2026-08-15" },
  });
  fireEvent.change(screen.getByLabelText("간단한 후기"), {
    target: { value: "남은 채소 정리" },
  });
  mockedTriggerHaptic.mockClear();
  fireEvent.click(screen.getByRole("button", { name: "기록하기" }));

  await waitFor(() =>
    expect(createRecord).toHaveBeenCalledWith({
      sourceType: "MANUAL",
      recordTitle: "야식 볶음밥",
      recordMemo: "남은 채소 정리",
      cookedAt: expect.stringMatching(/^2026-08-15T12:00[+-]\d{2}:\d{2}$/),
      images: [{ file: imageFile, purpose: "ORIGINAL" }],
    })
  );
  expect(
    screen.getByRole("heading", { name: "요리 기록을 남겼어요" })
  ).toBeInTheDocument();
  expect(mockedTriggerHaptic).toHaveBeenCalledTimes(1);
  expect(mockedTriggerHaptic).toHaveBeenCalledWith("Success");
});

it("완료 드로어를 닫는 동안 작성 화면 닫기 버튼을 다시 보여주지 않습니다", async () => {
  const onOpenChange = jest.fn();
  createRecord.mockResolvedValue({ recordId: "record-A" });
  const ControlledDrawer = () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <ManualCookingRecordDrawer
        isOpen={isOpen}
        copy={copy}
        onOpenChange={(open) => {
          onOpenChange(open);
          setIsOpen(open);
        }}
      />
    );
  };
  render(<ControlledDrawer />);

  fireEvent.change(screen.getByLabelText("요리 사진"), {
    target: {
      files: [new File(["image"], "dish.jpg", { type: "image/jpeg" })],
    },
  });
  fireEvent.change(screen.getByLabelText("요리 이름"), {
    target: { value: "달걀볶음밥" },
  });
  fireEvent.click(screen.getByRole("button", { name: "기록하기" }));

  await screen.findByRole("heading", { name: "요리 기록을 남겼어요" });
  fireEvent.click(screen.getByRole("button", { name: "닫기" }));

  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(
    screen.queryByRole("button", { name: "요리 기록 추가 닫기" })
  ).not.toBeInTheDocument();
});

it("오늘 기록은 현재 시각을 넘지 않는 cookedAt으로 전달합니다", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-08-18T00:26:11+09:00"));
  createRecord.mockResolvedValue({ recordId: "record-A" });
  render(
    <ManualCookingRecordDrawer isOpen copy={copy} onOpenChange={jest.fn()} />
  );
  const imageFile = new File(["image"], "dish.jpg", { type: "image/jpeg" });

  fireEvent.change(screen.getByLabelText("요리 사진"), {
    target: { files: [imageFile] },
  });
  fireEvent.change(screen.getByLabelText("요리 이름"), {
    target: { value: "새벽 볶음밥" },
  });
  fireEvent.click(screen.getByRole("button", { name: "기록하기" }));

  await waitFor(() => expect(createRecord).toHaveBeenCalledTimes(1));
  expect(createRecord).toHaveBeenCalledWith(
    expect.objectContaining({
      cookedAt: "2026-08-18T00:26+09:00",
    })
  );
});

it("자동 재요청이 최종 실패하면 작성값을 유지한 채 오류를 보여줍니다", async () => {
  createRecord.mockRejectedValue(new Error("processing timeout"));
  render(
    <ManualCookingRecordDrawer isOpen copy={copy} onOpenChange={jest.fn()} />
  );
  const imageFile = new File(["image"], "dish.jpg", { type: "image/jpeg" });

  fireEvent.change(screen.getByLabelText("요리 사진"), {
    target: { files: [imageFile] },
  });
  fireEvent.change(screen.getByLabelText("요리 이름"), {
    target: { value: "실패해도 남는 볶음밥" },
  });
  fireEvent.click(screen.getByRole("button", { name: "기록하기" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "기록하지 못했습니다."
  );
  expect(screen.getByLabelText("요리 이름")).toHaveValue(
    "실패해도 남는 볶음밥"
  );
});
