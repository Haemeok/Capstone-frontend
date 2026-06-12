import type { Plural } from "./types";

export const format = (
  template: string,
  vars: Record<string, string | number>
): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : ""
  );

export const plural = (n: number, forms: Plural): string =>
  n === 1 ? forms.one : forms.other;
