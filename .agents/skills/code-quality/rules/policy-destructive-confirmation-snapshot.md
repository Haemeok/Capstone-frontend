---
title: Snapshot Destructive Confirmation Labels and Payload Together
prefix: policy
trigger: Opening a delete/archive dialog whose summary is derived from filtered, paginated, or otherwise changing selection data.
---

## Symptom

A confirmation dialog names one set of records, but confirming deletes a different set. This commonly appears after selecting across filters: the dialog can only resolve names from the current list while the mutation still receives every selected ID.

## Root cause

The dialog snapshots display labels when it opens but reads mutation IDs from live state when the user confirms. Labels and payload therefore have different sources or different capture times. A modal usually blocks clicks, but that does not make the contract safe: props, query results, or selection state can still change programmatically.

## Recommended pattern

Capture the complete confirmation contract in one state update, then render and mutate from that same snapshot.

```tsx
type ConfirmedSelection = {
  ids: string[];
  names: string[];
};

const [confirmed, setConfirmed] = useState<ConfirmedSelection>({
  ids: [],
  names: [],
});

const openConfirmation = () => {
  setConfirmed({
    ids: Array.from(selection.ids),
    names: Array.from(selection.ids).map((id) => selection.namesById.get(id) ?? id),
  });
  setIsOpen(true);
};

const confirm = () => mutation.mutate(confirmed.ids);
```

Keep the canonical selection and its label lookup synchronized in the same command. Test a cross-filter selection and an open-dialog-then-props-change case; the summary and mutation payload must still describe the same records in the same order.

## Anti-pattern

```tsx
const openConfirmation = () => {
  setConfirmedNames(currentPage.filter((item) => selectedIds.has(item.id)).map((item) => item.name));
  setIsOpen(true);
};

const confirm = () => mutation.mutate(Array.from(selectedIds));
```

The visible summary is limited to `currentPage`, while the mutation reads the complete live selection later. The confirmation no longer authorizes the actual destructive request.

## Heuristic

Treat a destructive confirmation as an immutable command preview: every user-visible label, count, and request identifier must come from one snapshot captured when the dialog opens. If the summary cannot name an ID, do not silently omit it or read the payload from another source.
