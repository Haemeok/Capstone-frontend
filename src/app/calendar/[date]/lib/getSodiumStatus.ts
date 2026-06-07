export type SodiumTone = "normal" | "caution";

export type SodiumStatus = {
  label: string;
  description: string;
  tone: SodiumTone;
};

export const getSodiumStatus = (sodium: number): SodiumStatus => {
  if (sodium <= 3000) {
    return { label: "좋음", description: "적정 섭취량이에요", tone: "normal" };
  }
  if (sodium <= 4000) {
    return { label: "보통", description: "조금 많이 드셨어요", tone: "normal" };
  }
  return { label: "주의", description: "짜게 드셨네요", tone: "caution" };
};
