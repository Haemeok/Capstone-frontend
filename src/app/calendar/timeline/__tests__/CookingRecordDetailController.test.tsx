import { type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { userPagesMessages } from "@/shared/i18n/userPagesMessages";

import { CookingRecordDetailController } from "../_components/CookingRecordDetailController";

const getCookingRecord = jest.fn();
const updateCookingRecordMetadata = jest.fn();
const prepareCookingRecordImage = jest.fn();
const patchCookingRecordImage = jest.fn();
const deleteCookingRecord = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/calendar/timeline",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

jest.mock("@/entities/recipe/model/recordApi", () => ({
  getCookingRecord: (...args: unknown[]) => getCookingRecord(...args),
}));

jest.mock("@/features/cooking-record-edit/model/api", () => ({
  updateCookingRecordMetadata: (...args: unknown[]) =>
    updateCookingRecordMetadata(...args),
  prepareCookingRecordImage: (...args: unknown[]) =>
    prepareCookingRecordImage(...args),
  patchCookingRecordImage: (...args: unknown[]) =>
    patchCookingRecordImage(...args),
}));

jest.mock("@/features/cooking-record-delete/model/api", () => ({
  deleteCookingRecord: (...args: unknown[]) => deleteCookingRecord(...args),
}));

jest.mock("@/shared/ui/image/Image", () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => {
  const Container = ({
    children,
    open,
  }: {
    children: ReactNode;
    open: boolean;
  }) => (open ? <div>{children}</div> : null);
  const Content = ({ children }: { children: ReactNode }) => (
    <section role="dialog">{children}</section>
  );
  const Header = ({ children }: { children: ReactNode }) => (
    <header>{children}</header>
  );
  const Title = ({ children }: { children: ReactNode }) => <h2>{children}</h2>;
  const Description = ({ children }: { children: ReactNode }) => (
    <p>{children}</p>
  );

  return {
    useResponsiveSheet: () => ({
      isMobile: true,
      Container,
      Content,
      Header,
      Title,
      Description,
    }),
  };
});

const selectedRecord = {
  record: {
    recordId: "record-a8f",
    recipeId: "recipe-a8f",
    displayTitle: "동파육",
    ingredientCost: null,
    marketPrice: null,
    nutrition: null,
    calories: null,
    imageUrl: "/records/original.webp",
    visibility: null,
    stickerImageUrl: "/records/sticker.webp",
    stickerStatus: "READY" as const,
    cookedAt: "2026-08-14T18:00:00+09:00",
    createdAt: "2026-08-14T18:00:00+09:00",
    sourceType: "RECIPE" as const,
    reviewId: null,
    recipeAvailable: true,
    savings: null,
    isRemix: null,
  },
  sticker: {
    id: "record-a8f",
    title: "동파육",
    cookedAtLabel: "8월 14일",
    imageUrl: "/records/sticker.webp",
    imageAlt: "동파육",
  },
};

const renderController = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <CookingRecordDetailController
        selectedRecord={selectedRecord}
        copy={userPagesMessages.ko.calendar.cookingRecord}
        onClose={jest.fn()}
      />
    </QueryClientProvider>
  );
};

describe("CookingRecordDetailController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCookingRecord.mockResolvedValue({
      recordId: "record-a8f",
      recipeId: "recipe-a8f",
      displayTitle: "동파육",
      recordMemo: "부드럽게 잘 익었습니다.",
      originalImageUrl: "/records/original.webp",
      stickerImageUrl: "/records/sticker.webp",
      stickerStatus: "READY",
      cookedAt: "2026-08-14T18:00:00+09:00",
      sourceType: "RECIPE",
      reviewId: null,
      recipeAvailable: true,
      ingredientCost: null,
      marketPrice: null,
      nutrition: null,
      calories: null,
      savings: null,
      visibility: null,
      isRemix: null,
      createdAt: "2026-08-14T18:00:00+09:00",
    });
    updateCookingRecordMetadata.mockResolvedValue({ message: "ok" });
    prepareCookingRecordImage.mockResolvedValue({
      recordId: "record-a8f",
      image: { originalKey: "original-key" },
    });
    patchCookingRecordImage.mockResolvedValue({ message: "ok" });
    deleteCookingRecord.mockResolvedValue({ message: "ok" });
  });

  it("요리 이름과 후기를 함께 수정하면 한 번에 저장하고 보기 화면에 반영합니다", async () => {
    renderController();

    expect(
      await screen.findByText("부드럽게 잘 익었습니다.")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "기록 수정" }));
    fireEvent.change(screen.getByRole("textbox", { name: "요리 이름" }), {
      target: { value: "매콤 동파육" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "간략 후기" }), {
      target: { value: "다음에는 간장을 조금 줄여야겠습니다." },
    });
    fireEvent.click(screen.getByRole("button", { name: "수정 내용 저장" }));

    await waitFor(() =>
      expect(updateCookingRecordMetadata).toHaveBeenCalledWith({
        recordId: "record-a8f",
        sourceType: "RECIPE",
        recordTitle: "매콤 동파육",
        recordMemo: "다음에는 간장을 조금 줄여야겠습니다.",
      })
    );
    expect(await screen.findByText("매콤 동파육")).toBeInTheDocument();
    expect(
      screen.getByText("다음에는 간장을 조금 줄여야겠습니다.")
    ).toBeInTheDocument();
  });

  it("요리 이름이 공백뿐이면 입력 오류를 보여주고 저장하지 않습니다", async () => {
    renderController();
    await screen.findByText("부드럽게 잘 익었습니다.");
    fireEvent.click(screen.getByRole("button", { name: "기록 수정" }));
    fireEvent.change(screen.getByRole("textbox", { name: "요리 이름" }), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "수정 내용 저장" }));

    expect(
      await screen.findByText("요리 이름을 입력해 주세요.")
    ).toHaveAttribute("role", "alert");
    expect(screen.getByRole("textbox", { name: "요리 이름" })).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(updateCookingRecordMetadata).not.toHaveBeenCalled();
  });

  it("요리 이름이 30자를 넘으면 길이 오류를 보여주고 저장하지 않습니다", async () => {
    renderController();
    await screen.findByText("부드럽게 잘 익었습니다.");
    fireEvent.click(screen.getByRole("button", { name: "기록 수정" }));
    fireEvent.change(screen.getByRole("textbox", { name: "요리 이름" }), {
      target: { value: "가".repeat(31) },
    });
    fireEvent.click(screen.getByRole("button", { name: "수정 내용 저장" }));

    expect(
      await screen.findByText("요리 이름은 30자까지 입력할 수 있어요.")
    ).toBeInTheDocument();
    expect(updateCookingRecordMetadata).not.toHaveBeenCalled();
  });

  it("후기가 500자를 넘으면 길이 오류를 보여주고 저장하지 않습니다", async () => {
    renderController();
    await screen.findByText("부드럽게 잘 익었습니다.");
    fireEvent.click(screen.getByRole("button", { name: "기록 수정" }));
    fireEvent.change(screen.getByRole("textbox", { name: "간략 후기" }), {
      target: { value: "가".repeat(501) },
    });
    fireEvent.click(screen.getByRole("button", { name: "수정 내용 저장" }));

    expect(
      await screen.findByText("후기는 500자까지 입력할 수 있어요.")
    ).toBeInTheDocument();
    expect(updateCookingRecordMetadata).not.toHaveBeenCalled();
  });

  it("서버 저장에 실패하면 입력값과 수정 화면을 유지하고 오류를 보여줍니다", async () => {
    updateCookingRecordMetadata.mockRejectedValueOnce(new Error("failed"));
    renderController();
    await screen.findByText("부드럽게 잘 익었습니다.");
    fireEvent.click(screen.getByRole("button", { name: "기록 수정" }));
    fireEvent.change(screen.getByRole("textbox", { name: "요리 이름" }), {
      target: { value: "매콤 동파육" },
    });
    fireEvent.click(screen.getByRole("button", { name: "수정 내용 저장" }));

    await waitFor(() =>
      expect(updateCookingRecordMetadata).toHaveBeenCalledWith({
        recordId: "record-a8f",
        sourceType: "RECIPE",
        recordTitle: "매콤 동파육",
        recordMemo: "부드럽게 잘 익었습니다.",
      })
    );
    expect(
      await screen.findByText(
        "요리 기록을 수정하지 못했어요. 다시 시도해 주세요."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "요리 이름" })).toHaveValue(
      "매콤 동파육"
    );
  });

  it("사진을 선택하면 원본 사진 교체 뮤테이션을 시작합니다", async () => {
    renderController();
    await screen.findByText("부드럽게 잘 익었습니다.");
    const file = new File(["image"], "dinner.webp", { type: "image/webp" });

    fireEvent.change(screen.getByLabelText("사진 바꾸기"), {
      target: { files: [file] },
    });

    await waitFor(() =>
      expect(prepareCookingRecordImage).toHaveBeenCalledWith({
        recordId: "record-a8f",
        images: [{ file, purpose: "ORIGINAL" }],
      })
    );
  });

  it("삭제 확인은 드로어를 열 때 선택한 기록 ID로 요청합니다", async () => {
    const user = userEvent.setup();
    renderController();
    await screen.findByText("부드럽게 잘 익었습니다.");

    await user.click(screen.getByRole("button", { name: "요리 기록 더보기" }));
    await user.click(await screen.findByText("이 기록 삭제"));
    await user.click(screen.getByRole("button", { name: "삭제" }));

    await waitFor(() =>
      expect(deleteCookingRecord).toHaveBeenCalledWith("record-a8f")
    );
  });
});
