"use client";

import { ImageField } from "./ImageField";

type Props = { className?: string };

export const MainImageField = ({ className }: Props) => {
  return <ImageField name="image" className={className} />;
};
