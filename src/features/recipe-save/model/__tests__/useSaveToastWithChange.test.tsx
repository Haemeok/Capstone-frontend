import { fireEvent, render, screen } from "@testing-library/react";

import { useToastStore } from "@/shared/ui/toast/model/store";

import { useSaveToastWithChange } from "../useSaveToastWithChange";

jest.mock("next/navigation", () => ({ usePathname: () => "/" }));
jest.mock("next/dynamic", () => {
  const React = jest.requireActual("react");
  return (loader: () => Promise<unknown>) => {
    const Component = React.lazy(() =>
      loader().then((component) => ({ default: component }))
    );
    const DynamicComponent = (props: object) => (
      <React.Suspense fallback={null}>
        <Component {...props} />
      </React.Suspense>
    );
    return DynamicComponent;
  };
});

jest.mock("@/features/recipe-book-change", () => ({
  ChangeBookSheet: ({
    open,
    onOpenChange,
    recipeId,
    fromBookId,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipeId: string;
    fromBookId?: string;
  }) => (
    <div data-testid="change-sheet" data-open={open}>
      <span>
        {recipeId}:{fromBookId}
      </span>
      <input aria-label="retained-state" />
      <button onClick={() => onOpenChange(false)}>close</button>
    </div>
  ),
}));

const Harness = () => {
  const { notifySaved, changeSheet } = useSaveToastWithChange("recipe-a");
  const toasts = useToastStore((state) => state.toastList);
  const toast = toasts.at(-1);
  return (
    <>
      <button onClick={() => notifySaved({ id: "book-a", name: "My book" })}>
        save
      </button>
      {toast?.variant === "action" && (
        <button onClick={toast.action.onClick}>change</button>
      )}
      {changeSheet}
    </>
  );
};

it("mounts the change sheet only on the toast action and retains it through close and reopen", async () => {
  useToastStore.setState({ toastList: [] });
  render(<Harness />);
  expect(screen.queryByTestId("change-sheet")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("save"));
  expect(screen.queryByTestId("change-sheet")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("change"));
  expect(await screen.findByTestId("change-sheet")).toHaveAttribute(
    "data-open",
    "true"
  );
  expect(screen.getByText("recipe-a:book-a")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("retained-state"), {
    target: { value: "kept" },
  });
  fireEvent.click(screen.getByText("close"));
  expect(screen.getByTestId("change-sheet")).toHaveAttribute(
    "data-open",
    "false"
  );
  fireEvent.click(screen.getByText("change"));
  expect(screen.getByLabelText("retained-state")).toHaveValue("kept");
  expect(screen.getByTestId("change-sheet")).toHaveAttribute(
    "data-open",
    "true"
  );
});
