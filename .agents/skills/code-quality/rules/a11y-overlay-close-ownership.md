---
title: Let Shared Overlay Content Own the Close Control
prefix: a11y
trigger: Adding or customizing a Dialog/Drawer close button, or seeing two overlapping X buttons in an overlay.
---

## Symptom

A Dialog or Drawer shows two overlapping X buttons. One comes from the shared content primitive and another comes from a feature header. Attempts to hide the shared button with a descendant selector may silently fail when the primitive bypasses the wrapper that supplies the expected `data-slot` attribute.

## Recommended pattern

Make the shared content component render exactly one primitive close control. Consumers may supply its accessible label, position classes, or disabled state, but not its visibility. Keep close behavior in the controlled root's `onOpenChange` handler.

```tsx
const DialogContent = ({
  closeLabel = "Close",
  closeButtonClassName,
  closeDisabled,
  children,
  ...props
}: ContentProps) => (
  <Primitive.Content {...props}>
    {children}
    <Primitive.Close
      data-slot="dialog-close"
      aria-label={closeLabel}
      disabled={closeDisabled}
      className={closeButtonClassName}
    >
      <X aria-hidden="true" />
    </Primitive.Close>
  </Primitive.Content>
);
```

At the shared primitive layer, render a real Dialog and Drawer and assert that each exposes exactly one named close button with the expected `data-slot`. Add a representative feature integration test when the overlay changes state in place.

## Anti-pattern

```tsx
<DialogContent shouldShowCloseButton={false}>
  <Header>
    <button aria-label="Close">
      <X />
    </button>
  </Header>
</DialogContent>
```

This splits ownership between the shared primitive and every consumer. A new surface can forget the visibility flag, while CSS hiding depends on DOM details that wrappers can accidentally omit.

## Heuristic

Search overlay consumers for imported X icons, direct top-corner close buttons, `shouldShowCloseButton`, and selectors that hide `dialog-close` or direct child buttons. The shared Dialog/Drawer content should be the only source of the X; footer cancel actions may still use primitive close wrappers because they are separate labeled actions.
