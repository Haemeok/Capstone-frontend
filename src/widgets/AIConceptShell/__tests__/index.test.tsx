import { act, render, screen } from "@testing-library/react";

import { useAIRecipeFocusStore } from "@/features/recipe-create-ai/model/focusStore";
import type { ActiveAIJob } from "@/features/recipe-create-ai/model/types";

import { useToastStore } from "@/widgets/Toast";

import AIConceptShell from "../index";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn() }),
}));

jest.mock("next/dynamic", () => () => {
  const MockedComponent = (props: { progress?: number; error?: string }) => (
    <div data-testid="dynamic-stub">
      {props.error ?? `loading ${props.progress ?? ""}`}
    </div>
  );
  return MockedComponent;
});

const baseJob: ActiveAIJob = {
  idempotencyKey: "key-1",
  concept: "COST_EFFECTIVE",
  meta: {
    concept: "COST_EFFECTIVE",
    displayName: "가성비 요리",
    requestSummary: "summary",
  },
  request: { targetBudget: 10000, targetCategory: "한식" },
  jobId: "job-1",
  startTime: Date.now(),
  lastPollTime: Date.now(),
  retryCount: 0,
  state: "polling",
  progress: 30,
};

beforeEach(() => {
  mockReplace.mockClear();
  act(() => {
    useAIRecipeFocusStore.setState({ focusFormPage: false });
    useToastStore.setState({ toastList: [] });
  });
});

describe("AIConceptShell", () => {
  it("idle 상태에서 children 을 렌더하고 focus mode 를 켠다", () => {
    render(
      <AIConceptShell
        concept="COST_EFFECTIVE"
        job={undefined}
        isPending={false}
        isFailed={false}
        progress={0}
        onRetry={jest.fn()}
      >
        <div data-testid="form">form</div>
      </AIConceptShell>
    );

    expect(screen.getByTestId("form")).toBeInTheDocument();
    expect(useAIRecipeFocusStore.getState().focusFormPage).toBe(true);
  });

  it("unmount 시 focus mode 를 끈다", () => {
    const { unmount } = render(
      <AIConceptShell
        concept="COST_EFFECTIVE"
        job={undefined}
        isPending={false}
        isFailed={false}
        progress={0}
        onRetry={jest.fn()}
      >
        <div>form</div>
      </AIConceptShell>
    );

    expect(useAIRecipeFocusStore.getState().focusFormPage).toBe(true);

    unmount();

    expect(useAIRecipeFocusStore.getState().focusFormPage).toBe(false);
  });

  it("isPending 일 땐 AiLoading 으로 분기하고 focus mode 를 켜지 않는다", () => {
    render(
      <AIConceptShell
        concept="COST_EFFECTIVE"
        job={baseJob}
        isPending
        isFailed={false}
        progress={30}
        onRetry={jest.fn()}
      >
        <div data-testid="form">form</div>
      </AIConceptShell>
    );

    expect(screen.queryByTestId("form")).not.toBeInTheDocument();
    expect(useAIRecipeFocusStore.getState().focusFormPage).toBe(false);
  });

  it("isFailed 일 땐 AIRecipeError 분기하고 focus mode 를 켜지 않는다", () => {
    render(
      <AIConceptShell
        concept="COST_EFFECTIVE"
        job={{ ...baseJob, state: "failed", message: "에러" }}
        isPending={false}
        isFailed
        progress={0}
        onRetry={jest.fn()}
      >
        <div data-testid="form">form</div>
      </AIConceptShell>
    );

    expect(screen.queryByTestId("form")).not.toBeInTheDocument();
    expect(useAIRecipeFocusStore.getState().focusFormPage).toBe(false);
  });

  it("job.state === 'completed' 이면 router.replace 로 결과 페이지 이동", () => {
    render(
      <AIConceptShell
        concept="COST_EFFECTIVE"
        job={{
          ...baseJob,
          state: "completed",
          progress: 100,
          resultRecipeId: "recipe-xyz",
        }}
        isPending={false}
        isFailed={false}
        progress={100}
        onRetry={jest.fn()}
      >
        <div>form</div>
      </AIConceptShell>
    );

    expect(mockReplace).toHaveBeenCalledWith("/recipes/recipe-xyz");
  });

  it("completed + successToastId 가 있으면 해당 toast 를 dismiss 한다", () => {
    const id = useToastStore.getState().addToast({
      message: "test",
      variant: "success",
    });

    render(
      <AIConceptShell
        concept="COST_EFFECTIVE"
        job={{
          ...baseJob,
          state: "completed",
          progress: 100,
          resultRecipeId: "recipe-xyz",
          successToastId: id,
        }}
        isPending={false}
        isFailed={false}
        progress={100}
        onRetry={jest.fn()}
      >
        <div>form</div>
      </AIConceptShell>
    );

    expect(useToastStore.getState().toastList).toHaveLength(0);
  });

  it("completed 일 땐 children 폼을 렌더하지 않는다 (form flash 방지)", () => {
    render(
      <AIConceptShell
        concept="COST_EFFECTIVE"
        job={{
          ...baseJob,
          state: "completed",
          progress: 100,
          resultRecipeId: "recipe-xyz",
        }}
        isPending={false}
        isFailed={false}
        progress={100}
        onRetry={jest.fn()}
      >
        <div data-testid="form">form</div>
      </AIConceptShell>
    );

    expect(screen.queryByTestId("form")).not.toBeInTheDocument();
  });
});
