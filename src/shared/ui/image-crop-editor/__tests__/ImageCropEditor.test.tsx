import { act, fireEvent, render, screen } from "@testing-library/react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { CroppedPhoto } from "../CroppedPhoto";
import { ImageCropEditor } from "../ImageCropEditor";

jest.mock("next/navigation", () => ({ usePathname: () => "/" }));

jest.mock("@/shared/lib/bridge", () => ({
  triggerHaptic: jest.fn(),
}));

const COPY = {
  title: "사진 위치 조정",
  hint: "사진을 움직여 접시에 맞춰 주세요.",
  cancel: "취소",
  done: "완료",
  replace: "사진 변경",
};

const firePointerEvent = (
  element: HTMLElement,
  type: string,
  init: { pointerId: number; clientX?: number; clientY?: number }
) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: init.clientX,
    clientY: init.clientY,
  });
  Object.defineProperty(event, "pointerId", { value: init.pointerId });
  fireEvent(element, event);
};

const renderEditor = () => {
  const onChange = jest.fn();
  const onComplete = jest.fn();
  const onCancel = jest.fn();
  const onReplace = jest.fn();
  const result = render(
    <ImageCropEditor
      src="/dish.jpg"
      imageSize={{ width: 2000, height: 1000 }}
      crop={{ centerX: 0.5, centerY: 0.5, zoom: 1 }}
      maskPath="M 50 2 A 48 48 0 1 1 49.99 2 Z"
      onChange={onChange}
      onComplete={onComplete}
      onCancel={onCancel}
      onReplace={onReplace}
      copy={COPY}
    />
  );

  const surface = screen.getByRole("application", { name: COPY.title });
  Object.defineProperty(surface, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      width: 300,
      height: 300,
      top: 0,
      left: 0,
      right: 300,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  });
  const setPointerCapture = jest.fn();
  const releasePointerCapture = jest.fn();
  Object.defineProperty(surface, "setPointerCapture", {
    configurable: true,
    value: setPointerCapture,
  });
  Object.defineProperty(surface, "releasePointerCapture", {
    configurable: true,
    value: releasePointerCapture,
  });

  return {
    ...result,
    surface,
    setPointerCapture,
    releasePointerCapture,
    onChange,
    onComplete,
    onCancel,
    onReplace,
  };
};

describe("ImageCropEditor", () => {
  it("포인터를 캡처해 드래그하고 취소된 포인터의 후속 이동은 무시한다", () => {
    const { surface, setPointerCapture, releasePointerCapture, onChange } =
      renderEditor();

    firePointerEvent(surface, "pointerdown", {
      pointerId: 1,
      clientX: 150,
      clientY: 150,
    });
    firePointerEvent(surface, "pointermove", {
      pointerId: 1,
      clientX: 180,
      clientY: 150,
    });

    expect(setPointerCapture).toHaveBeenCalledWith(1);
    expect(onChange).toHaveBeenLastCalledWith({
      centerX: 0.45,
      centerY: 0.5,
      zoom: 1,
    });

    firePointerEvent(surface, "pointercancel", { pointerId: 1 });
    firePointerEvent(surface, "pointermove", {
      pointerId: 1,
      clientX: 210,
      clientY: 150,
    });

    expect(releasePointerCapture).toHaveBeenCalledWith(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("두 포인터의 거리를 사용해 중간점 기준으로 확대한다", () => {
    const { surface, onChange } = renderEditor();

    firePointerEvent(surface, "pointerdown", {
      pointerId: 1,
      clientX: 100,
      clientY: 150,
    });
    firePointerEvent(surface, "pointerdown", {
      pointerId: 2,
      clientX: 200,
      clientY: 150,
    });
    firePointerEvent(surface, "pointermove", {
      pointerId: 1,
      clientX: 80,
      clientY: 150,
    });
    firePointerEvent(surface, "pointermove", {
      pointerId: 2,
      clientX: 220,
      clientY: 150,
    });

    expect(onChange).toHaveBeenLastCalledWith({
      centerX: 0.5,
      centerY: 0.5,
      zoom: 1.4,
    });
  });

  it("휠과 키보드로 확대 및 이동할 수 있다", () => {
    const { surface, onChange } = renderEditor();

    fireEvent.wheel(surface, { clientX: 150, clientY: 150, deltaY: -100 });
    expect(onChange.mock.lastCall?.[0].zoom).toBeGreaterThan(1);

    fireEvent.keyDown(surface, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("버튼 동작을 외부 콜백에 위임하고 완료에만 성공 햅틱을 준다", () => {
    const { onComplete, onCancel, onReplace } = renderEditor();

    fireEvent.click(screen.getByRole("button", { name: COPY.replace }));
    fireEvent.click(screen.getByRole("button", { name: COPY.cancel }));
    fireEvent.click(screen.getByRole("button", { name: COPY.done }));

    expect(onReplace).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledWith("Success");
  });

  it("줌 숫자, 슬라이더, 파일 입력을 렌더링하지 않는다", () => {
    const { container } = renderEditor();

    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(
      container.querySelector('input[type="file"]')
    ).not.toBeInTheDocument();
  });

  it("maskPath를 SVG clipPath에 그대로 연결한다", () => {
    const { container } = renderEditor();

    expect(container.querySelector("clipPath path")).toHaveAttribute(
      "d",
      "M 50 2 A 48 48 0 1 1 49.99 2 Z"
    );
  });

  it("표시용 사진 바깥은 투명하고 편집기 무대에만 배경색을 둔다", () => {
    const { container } = render(
      <CroppedPhoto
        src="/transparent-dish.png"
        imageSize={{ width: 1000, height: 1000 }}
        crop={{ centerX: 0.5, centerY: 0.5, zoom: 1 }}
        maskPath="M 0 0 H 100 V 100 H 0 Z"
        alt="투명 음식"
      />
    );

    expect(container.firstElementChild).not.toHaveClass("bg-gray-100");

    const editor = renderEditor();
    expect(editor.surface).toHaveClass("bg-gray-100");
  });

  it("이미지를 끝내 불러오지 못하면 외부 fallback을 표시한다", () => {
    jest.useFakeTimers();
    try {
      render(
        <CroppedPhoto
          src="/broken-crop.jpg"
          imageSize={{ width: 1000, height: 1000 }}
          crop={{ centerX: 0.5, centerY: 0.5, zoom: 1 }}
          maskPath="M 0 0 H 100 V 100 H 0 Z"
          alt="깨진 음식"
          errorFallback={<span>사진을 표시할 수 없습니다.</span>}
        />
      );

      fireEvent.error(screen.getByAltText("깨진 음식"));
      act(() => jest.advanceTimersByTime(2000));
      fireEvent.error(screen.getByAltText("깨진 음식"));
      act(() => jest.advanceTimersByTime(2000));
      fireEvent.error(screen.getByAltText("깨진 음식"));

      expect(
        screen.getByText("사진을 표시할 수 없습니다.")
      ).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });
});
