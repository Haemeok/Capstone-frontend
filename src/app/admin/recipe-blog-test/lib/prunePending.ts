export const prunePending = (
  selected: Set<string>,
  pending: Set<string>
): Set<string> => {
  if (pending.size === 0) return selected;
  const out = new Set<string>();
  for (const s of selected) {
    if (!pending.has(s)) out.add(s);
  }
  return out;
};
