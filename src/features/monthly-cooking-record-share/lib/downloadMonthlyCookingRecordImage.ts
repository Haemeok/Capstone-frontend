export const getMonthlyCookingRecordImageFileName = (
  monthKey: string
): string => `recipio-cooking-record-${monthKey}.png`;

export const downloadMonthlyCookingRecordImage = (
  blob: Blob,
  monthKey: string
): void => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = getMonthlyCookingRecordImageFileName(monthKey);
  document.body.append(anchor);

  try {
    anchor.click();
  } finally {
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }
};
