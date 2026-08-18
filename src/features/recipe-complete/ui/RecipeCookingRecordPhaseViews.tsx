import type { ReactNode } from "react";

import { formatNumber } from "@/shared/lib/format";

import type { RecipeCookingRecordCopy } from "./recipeCookingRecord.types";

type RewardPhaseProps = {
  saveAmount: number;
  copy: RecipeCookingRecordCopy;
  title: ReactNode;
  description: ReactNode;
};

export const RecipeCookingRecordRewardPhase = ({
  saveAmount,
  copy,
  title,
  description,
}: RewardPhaseProps) => (
  <div className="px-6 pt-8 pb-16 text-center">
    {title}
    {description}
    <p className="text-olive-dark mt-2 text-[44px] font-bold tracking-[-0.05em]">
      {formatNumber(saveAmount, "원")}
    </p>
    <p className="text-ink-muted mt-8 text-sm">{copy.rewardNext}</p>
  </div>
);

type SuccessPhaseProps = {
  copy: RecipeCookingRecordCopy;
  title: ReactNode;
  description: ReactNode;
  onClose: () => void;
};

export const RecipeCookingRecordSuccessPhase = ({
  copy,
  title,
  description,
  onClose,
}: SuccessPhaseProps) => (
  <div className="px-6 pt-10 pb-6 text-center">
    {title}
    {description}
    <button
      type="button"
      onClick={onClose}
      className="bg-olive-light mt-10 h-12 w-full cursor-pointer rounded-xl font-bold text-white"
    >
      {copy.successClose}
    </button>
  </div>
);
