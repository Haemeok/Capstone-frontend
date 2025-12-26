export type CookingTerm = {
  term: string;
  description: string;
};

export type TextSegment = {
  text: string;
  isTerm?: boolean;
  termData?: CookingTerm;
};

export type CookingTermsResult = {
  segments: TextSegment[];
  allTerms: CookingTerm[];
};

export const extractCookingTerms = (text: string): CookingTermsResult => {
  const pattern = /\*\*([^(]+)\(([^)]+)\)\*\*/g;
  const allTerms: CookingTerm[] = [];
  const segments: TextSegment[] = [];

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }

    const term = match[1].trim();
    const description = match[2].trim();
    const termData = { term, description };

    allTerms.push(termData);
    segments.push({ text: term, isTerm: true, termData });

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return { segments, allTerms };
};
