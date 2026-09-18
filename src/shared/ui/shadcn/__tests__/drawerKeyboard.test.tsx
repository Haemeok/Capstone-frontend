import { act, render, screen } from "@testing-library/react";

import { Drawer, DrawerContent, DrawerTitle } from "../drawer";

const viewport = Object.assign(new EventTarget(), {
  height: 844,
  offsetTop: 0,
  scale: 1,
});

const resize = (height: number) => {
  act(() => {
    viewport.height = height;
    viewport.dispatchEvent(new Event("resize"));
    jest.advanceTimersByTime(32);
  });
};

beforeEach(() => {
  jest.useFakeTimers();
  viewport.height = 844;
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 844,
  });
  Object.defineProperty(window, "visualViewport", {
    configurable: true,
    value: viewport,
  });
});
afterEach(() => jest.useRealTimers());

test("preserves caller dimensions across keyboard cycles and reopening", () => {
  const sheet = (open: boolean) => (
    <Drawer open={open}>
      <DrawerContent style={{ height: 600, bottom: 8 }}>
        <DrawerTitle>Cooking record</DrawerTitle>
        <textarea aria-label="Review" />
      </DrawerContent>
    </Drawer>
  );
  const { rerender } = render(sheet(false));
  rerender(sheet(true));
  for (const closeSteps of [[844], [600, 720, 844]]) {
    const drawer = screen.getByRole("dialog");
    act(() => screen.getByLabelText("Review").focus());
    resize(500);
    expect(drawer.style.bottom).toBe("344px");
    act(() => screen.getByLabelText("Review").blur());
    closeSteps.forEach(resize);
    expect(drawer.style.bottom).toBe("8px");
    expect(drawer.style.height).toBe("600px");
    rerender(sheet(false));
    act(() => jest.advanceTimersByTime(600));
    rerender(sheet(true));
  }
});

test("restores the drawer when the keyboard closes while the textarea keeps focus", () => {
  render(
    <Drawer open>
      <DrawerContent>
        <DrawerTitle>Cooking record</DrawerTitle>
        <textarea aria-label="Review" />
      </DrawerContent>
    </Drawer>
  );
  const drawer = screen.getByRole("dialog");
  act(() => screen.getByLabelText("Review").focus());
  resize(500);
  resize(600);
  resize(720);
  resize(844);
  expect(screen.getByLabelText("Review")).toHaveFocus();
  expect(drawer.style.bottom).toBe("");
  expect(drawer.style.height).toBe("");
});

test.each([675, 760])(
  "restores a %ipx bottom drawer after a blurred input and staged keyboard dismissal",
  (height) => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Cooking record</DrawerTitle>
          <textarea aria-label="Review" />
        </DrawerContent>
      </Drawer>
    );
    const drawer = screen.getByRole("dialog");
    jest.spyOn(drawer, "getBoundingClientRect").mockReturnValue({
      height,
      top: 844 - height,
      bottom: 844,
      width: 390,
      left: 0,
      right: 390,
      x: 0,
      y: 844 - height,
      toJSON: () => ({}),
    });
    act(() => screen.getByLabelText("Review").focus());
    resize(500);
    expect(drawer.style.bottom).toBe("344px");
    act(() => screen.getByLabelText("Review").blur());
    resize(600);
    resize(720);
    resize(844);
    expect(drawer.style.bottom).toBe("");
    expect(drawer.style.height).toBe("");
    expect(screen.getByLabelText("Review")).toBeInTheDocument();
  }
);
