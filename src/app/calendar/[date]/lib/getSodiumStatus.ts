export type SodiumStatusKey = "good" | "normal" | "warning";
export type SodiumTone = "normal" | "caution";

export type SodiumStatus = {
  key: SodiumStatusKey;
  tone: SodiumTone;
};

export const getSodiumStatus = (sodium: number): SodiumStatus => {
  if (sodium <= 3000) {
    return { key: "good", tone: "normal" };
  }
  if (sodium <= 4000) {
    return { key: "normal", tone: "normal" };
  }
  return { key: "warning", tone: "caution" };
};
