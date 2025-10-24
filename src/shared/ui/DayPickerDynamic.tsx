"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";

const DayPickerLazy = dynamic(
  () => import("react-day-picker").then((mod) => ({ default: mod.DayPicker })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-sm text-gray-500">달력 로딩 중...</div>
      </div>
    ),
  }
);

type DayPickerDynamicProps = ComponentProps<typeof DayPicker>;

export const DayPickerDynamic = (props: DayPickerDynamicProps) => {
  return <DayPickerLazy {...props} />;
};
