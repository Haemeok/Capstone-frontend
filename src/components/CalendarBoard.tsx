import { Calendar } from "@/components/ui/calendar";
import React from "react";

const CalendarBoard = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow w-full"
    />
  );
};

export default CalendarBoard;
