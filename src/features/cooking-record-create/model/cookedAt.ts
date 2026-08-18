export const toCookingRecordOffsetDateTime = (dateValue: string) => {
  const now = new Date();
  const todayValue = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const cookedAt =
    dateValue === todayValue ? now : new Date(`${dateValue}T12:00:00`);
  const offsetMinutes = -cookedAt.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const hours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(
    2,
    "0"
  );
  const minutes = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");
  const cookedHour = String(cookedAt.getHours()).padStart(2, "0");
  const cookedMinute = String(cookedAt.getMinutes()).padStart(2, "0");

  return `${dateValue}T${cookedHour}:${cookedMinute}${sign}${hours}:${minutes}`;
};
