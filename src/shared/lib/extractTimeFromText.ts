export const extractTimeFromText = (text: string): number | null => {
  if (!text) return null;

  const timePatterns = [
    { regex: /(\d+(?:\.\d+)?)\s*시간/g, multiplier: 3600 },
    { regex: /(\d+(?:\.\d+)?)\s*분/g, multiplier: 60 },
    { regex: /(\d+(?:\.\d+)?)\s*초/g, multiplier: 1 },
  ];

  let totalSeconds = 0;
  let foundTime = false;

  for (const { regex, multiplier } of timePatterns) {
    const matches = text.matchAll(regex);
    for (const match of matches) {
      const value = parseFloat(match[1]);
      if (!isNaN(value)) {
        totalSeconds += value * multiplier;
        foundTime = true;
      }
    }
  }

  return foundTime ? totalSeconds : null;
};
