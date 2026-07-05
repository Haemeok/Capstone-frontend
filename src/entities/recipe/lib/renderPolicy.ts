import { connection } from "next/server";

export const renderDynamic = (): Promise<void> => connection();

export const applyIndexedRenderPolicy = async (
  isIndexed: boolean | undefined
): Promise<void> => {
  if (isIndexed === false) await renderDynamic();
};
