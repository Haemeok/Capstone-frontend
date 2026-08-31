import { notFound } from "next/navigation";

import { isTagCode, type TagCode } from "@/shared/config/constants/recipe";

export const getCategoryTagCodeOrNotFound = (id: string): TagCode => {
  if (!isTagCode(id)) notFound();
  return id;
};
