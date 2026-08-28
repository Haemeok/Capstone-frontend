/** @jest-environment jsdom */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { DictionaryProvider, getDictionary } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import { COOKING_REVIEW_QUERY_KEYS } from "@/entities/cooking-review";

import { createRecipeRecord } from "../../model/api";
import { FirstCookingReviewButton } from "../FirstCookingReviewButton";

jest.mock("../../model/api", () => ({
  prepareRecipeCookingRecord: jest.fn(async (input) => input),
  createRecipeRecord: jest.fn(),
}));

jest.mock("@/shared/lib/hooks/useResponsiveSheet", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const OpenChangeContext = React.createContext<(open: boolean) => void>(
    () => undefined
  );

  return {
    useResponsiveSheet: (() => {
      const Container = ({
        children,
        open,
        onOpenChange,
      }: {
        children: React.ReactNode;
        open: boolean;
        onOpenChange: (open: boolean) => void;
      }) =>
        open ? (
          <OpenChangeContext.Provider value={onOpenChange}>
            <div>{children}</div>
          </OpenChangeContext.Provider>
        ) : null;
      const Content = ({
        children,
        closeLabel,
      }: {
        children: React.ReactNode;
        closeLabel?: string;
      }) => {
        const onOpenChange = React.useContext(OpenChangeContext);

        return (
          <section>
            {children}
            <button
              type="button"
              data-slot="dialog-close"
              aria-label={closeLabel ?? "Close"}
              onClick={() => onOpenChange(false)}
            />
          </section>
        );
      };
      const Title = ({ children }: { children: React.ReactNode }) => (
        <h2>{children}</h2>
      );
      const Description = ({ children }: { children: React.ReactNode }) => (
        <p>{children}</p>
      );
      return () => ({ Container, Content, Title, Description });
    })(),
  };
});

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
  Image: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

jest.mock("@/shared/lib/review", () => ({ trackReviewAction: jest.fn() }));
jest.mock("@/shared/lib/bridge", () => ({ triggerHaptic: jest.fn() }));

const createRecordMock = jest.mocked(createRecipeRecord);
const triggerHapticMock = jest.mocked(triggerHaptic);

const renderButton = (onBeforeStart = () => true) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const reviewData = {
    pages: [{ totalCount: 1, items: [], hasNext: false }],
    pageParams: [0],
  };

  queryClient.setQueryData(
    COOKING_REVIEW_QUERY_KEYS.publicList("recipe-a", false, 20),
    reviewData
  );
  queryClient.setQueryData(
    COOKING_REVIEW_QUERY_KEYS.publicList("recipe-a", true, 20),
    reviewData
  );

  render(
    <QueryClientProvider client={queryClient}>
      <DictionaryProvider dict={getDictionary("ko")}>
        <FirstCookingReviewButton
          recipeId="recipe-a"
          recipeTitle="정호영 냉우동"
          recipeImageUrl="/cold-udon.webp"
          saveAmount={5300}
          onBeforeStart={onBeforeStart}
        />
      </DictionaryProvider>
    </QueryClientProvider>
  );

  return queryClient;
};

const openFormAndSubmit = async () => {
  jest.useFakeTimers();
  fireEvent.click(
    screen.getByRole("button", { name: "첫 번째 요리 후기 남기기" })
  );
  act(() => jest.advanceTimersByTime(1800));
  fireEvent.change(screen.getByLabelText("간단한 후기"), {
    target: { value: "라임 향이 좋아요" },
  });
  fireEvent.click(screen.getByRole("button", { name: "기록하기" }));
  await act(async () => Promise.resolve());
  jest.useRealTimers();
};

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
});

afterEach(() => {
  jest.useRealTimers();
});

it("T-13: 시작 조건이 거부되면 작성 흐름과 요청을 시작하지 않는다", () => {
  renderButton(() => false);

  fireEvent.click(
    screen.getByRole("button", { name: "첫 번째 요리 후기 남기기" })
  );

  expect(screen.queryByRole("heading", { name: "요리 완료" })).toBeNull();
  expect(createRecordMock).not.toHaveBeenCalled();
  expect(triggerHapticMock).not.toHaveBeenCalledWith("Medium");
});

it("T-14: 시작 조건을 통과하면 작성 흐름을 열고 Medium 햅틱을 실행한다", () => {
  renderButton();

  fireEvent.click(
    screen.getByRole("button", { name: "첫 번째 요리 후기 남기기" })
  );

  expect(
    screen.getByRole("heading", { name: "요리 완료" })
  ).toBeInTheDocument();
  expect(triggerHapticMock).toHaveBeenCalledWith("Medium");
});

it("T-15: 공개 후기 저장은 Success 햅틱과 전체·사진 캐시 갱신으로 이어진다", async () => {
  createRecordMock.mockResolvedValue({
    recordId: "record-new",
    reviewId: "review-new",
    message: "created",
  });
  const queryClient = renderButton();

  await openFormAndSubmit();

  expect(createRecordMock).toHaveBeenCalledWith(
    expect.objectContaining({
      recipeId: "recipe-a",
      reviewContent: "라임 향이 좋아요",
      publishReview: true,
    })
  );
  expect(
    await screen.findByRole("heading", { name: "요리 기록을 남겼어요" })
  ).toBeInTheDocument();
  expect(triggerHapticMock).toHaveBeenCalledWith("Success");
  expect(
    queryClient.getQueryState(
      COOKING_REVIEW_QUERY_KEYS.publicList("recipe-a", false, 20)
    )?.isInvalidated
  ).toBe(true);
  expect(
    queryClient.getQueryState(
      COOKING_REVIEW_QUERY_KEYS.publicList("recipe-a", true, 20)
    )?.isInvalidated
  ).toBe(true);
});

it("T-16: 저장 실패는 오류를 보이고 닫은 뒤 CTA를 다시 열 수 있다", async () => {
  createRecordMock.mockRejectedValue(new Error("API Error: 500"));
  renderButton();

  await openFormAndSubmit();

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "기록하지 못했습니다."
  );
  fireEvent.click(screen.getByRole("button", { name: "닫기" }));
  fireEvent.click(
    screen.getByRole("button", { name: "첫 번째 요리 후기 남기기" })
  );
  expect(
    screen.getByRole("heading", { name: "요리 완료" })
  ).toBeInTheDocument();
});
