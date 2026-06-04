const LEADING_EMOJI = /^(?:\p{Extended_Pictographic}[\u{FE0F}\u{200D}]*)+\s*/u;

export const toShortTagLabel = (tag: string): string =>
  tag.replace(LEADING_EMOJI, "").split("/")[0].trim();
