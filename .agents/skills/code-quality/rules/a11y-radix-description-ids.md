---
title: Preserve Radix-Generated Description IDs
prefix: a11y
trigger: Adding a visible Dialog/Drawer description, overriding `id` or `aria-describedby`, or wrapping a Radix content primitive that suppresses description warnings.
---

## Symptom

A Dialog or Drawer visibly renders its `Description`, and the DOM may even show an `aria-describedby` value, but Radix still warns that the content is missing a description. A shared wrapper can create the opposite failure: no warning appears because it always sets `aria-describedby={undefined}`, while assistive technology receives no description association.

## Root cause

Radix stores a generated description ID in primitive context. `Content` and `Description` must use that same generated value. Passing a custom `id` to `Description` replaces only the DOM attribute; it does not replace the context value that Radix uses for its accessibility check. Likewise, a wrapper-level `aria-describedby={undefined}` overrides the automatic context linkage even when a real `Description` is present.

## Recommended pattern

Let the primitive own the ID. If a shared wrapper suppresses `aria-describedby` for description-free content, provide an explicit opt-in that omits that override entirely when a description exists.

```tsx
type ContentProps = React.ComponentProps<typeof Primitive.Content> & {
  hasDescription?: boolean;
};

const Content = ({ hasDescription, ...props }: ContentProps) => (
  <Primitive.Content
    {...(hasDescription ? {} : { "aria-describedby": undefined })}
    {...props}
  />
);

<Content hasDescription>
  <Primitive.Title>Existing item</Primitive.Title>
  <Primitive.Description>No charge was used.</Primitive.Description>
</Content>;
```

In an integration test that renders the actual primitive, assert that the content's `aria-describedby` equals the rendered description's `id`, and fail on Radix warnings.

## Anti-pattern

```tsx
const descriptionId = useId();

<Primitive.Content aria-describedby={descriptionId}>
  <Primitive.Description id={descriptionId}>
    No charge was used.
  </Primitive.Description>
</Primitive.Content>;
```

The DOM attributes match each other, but the custom ID replaces Radix's generated description ID and its internal accessibility check still looks for the missing generated element.

## Heuristic

When a Radix description warning survives visible markup, inspect both the primitive context path and wrapper defaults before adding another ID. Do not silence the warning in tests. Render the real primitive and verify `Content[aria-describedby]` points to the actual `Description[id]` with no `console.warn` call.
