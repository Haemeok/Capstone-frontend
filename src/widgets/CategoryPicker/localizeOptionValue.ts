import type { TaxonomyDomain } from "@/shared/i18n/taxonomyLabel";

export const localizeOptionValue = (
  value: string,
  domain: TaxonomyDomain,
  localize: (koValue: string, domain: TaxonomyDomain) => string
): string => {
  const spaceIndex = value.indexOf(" ");
  if (spaceIndex > 0) {
    const head = value.slice(0, spaceIndex);
    const rest = value.slice(spaceIndex + 1);
    const headHasNoWordChar = !/[\p{L}\p{N}]/u.test(head);
    if (headHasNoWordChar) return `${head} ${localize(rest, domain)}`;
  }
  return localize(value, domain);
};
