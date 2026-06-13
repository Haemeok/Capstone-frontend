export const getNextCardNewsPageParam = ({
  number,
  totalPages,
}: {
  number: number;
  totalPages: number;
}): number | undefined => (number + 1 < totalPages ? number + 1 : undefined);
