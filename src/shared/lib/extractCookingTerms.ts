export type CookingTerm = {
  term: string;
  description: string;
};

export type CookingTermsResult = {
  terms: CookingTerm[];
  cleanedText: string;
};

export const extractCookingTerms = (text: string): CookingTermsResult => {
  const pattern = /\*\*([^(]+)\(([^)]+)\)\*\*/g;
  const terms: CookingTerm[] = [];
  let match;

  while ((match = pattern.exec(text)) !== null) {
    terms.push({
      term: match[1].trim(),
      description: match[2].trim(),
    });
  }

  const cleanedText = text.replace(pattern, (_, term) => `*${term.trim()}`);

  return { terms, cleanedText };
};
