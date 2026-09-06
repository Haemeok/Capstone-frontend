const getElementState = (element: Element | null) => {
  if (!element) return null;
  const style = getComputedStyle(element);
  return {
    tag: element.tagName,
    scrollTop: Math.round(element.scrollTop),
    scrollHeight: element.scrollHeight,
    clientHeight: element.clientHeight,
    overflowY: style.overflowY,
    position: style.position,
    touchAction: style.touchAction,
    pointerEvents: style.pointerEvents,
  };
};

export const getScrollSnapshot = (
  container: HTMLElement,
  target: EventTarget | null
) => ({
  container: getElementState(container),
  body: getElementState(document.body),
  html: getElementState(document.documentElement),
  target: target instanceof Element ? getElementState(target) : null,
  windowY: Math.round(window.scrollY),
  viewportHeight: window.visualViewport?.height ?? window.innerHeight,
  viewportOffsetTop: window.visualViewport?.offsetTop ?? 0,
  focusedTag: document.activeElement?.tagName ?? null,
  bodyScrollLocked: document.body.hasAttribute("data-scroll-locked"),
  openDialogCount: document.querySelectorAll(
    '[role="dialog"][data-state="open"]'
  ).length,
});
