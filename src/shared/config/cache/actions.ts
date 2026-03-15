"use server";

import { revalidateTag } from "next/cache";

import { getTagsToInvalidate, type InvalidationEvent } from "./policies";

export const invalidateCache = async (event: InvalidationEvent) => {
  const tags = getTagsToInvalidate(event);
  tags.forEach((tag) => revalidateTag(tag));
};
