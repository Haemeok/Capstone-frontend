"use client";

import { ImageField } from "./ImageField";

type Props = { index: number; className?: string };

export const StepImageField = ({ index, className }: Props) => {
  return (
    <ImageField name={`steps.${index}.image` as const} className={className} />
  );
};
