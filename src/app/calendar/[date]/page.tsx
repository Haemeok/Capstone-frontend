"use client";

import { useParams } from "next/navigation";

import { DailyCookingRecordPageClient } from "./_components/DailyCookingRecordPageClient";

const CalendarDetailPage = () => {
  const { date } = useParams<{ date: string }>();
  return <DailyCookingRecordPageClient date={date} />;
};

export default CalendarDetailPage;
