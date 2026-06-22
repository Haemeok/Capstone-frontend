"use client";

import { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import dynamic from "next/dynamic";

import { useUiCommonDict } from "@/shared/i18n";

const DayPickerLoading = () => {
  const t = useUiCommonDict();

  return (
    <div className="flex h-96 w-full items-center justify-center">
      <div className="text-ink-muted text-sm">{t.calendar.loading}</div>
    </div>
  );
};

const DayPickerLazy = dynamic(
  () => import("react-day-picker").then((mod) => ({ default: mod.DayPicker })),
  {
    ssr: false,
    loading: () => <DayPickerLoading />,
  }
);

type DayPickerDynamicProps = ComponentProps<typeof DayPicker>;

export const DayPickerDynamic = (props: DayPickerDynamicProps) => {
  return <DayPickerLazy {...props} />;
};
