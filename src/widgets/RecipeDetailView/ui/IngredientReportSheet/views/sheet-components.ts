import type { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

export type SheetComponents = {
  Header: ReturnType<typeof useResponsiveSheet>["Header"];
  Title: ReturnType<typeof useResponsiveSheet>["Title"];
  Description: ReturnType<typeof useResponsiveSheet>["Description"];
};
