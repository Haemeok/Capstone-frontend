import { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import { useMediaQuery } from "./useMediaQuery";

// Dialog 패딩을 Drawer와 동일하게 맞춤
// DialogContent: p-6 gap-4 → p-0 gap-0
// DialogHeader: 없음 → p-4
// DialogFooter: 없음 → p-4

const SheetContent = ({
  className,
  ...props
}: ComponentProps<typeof DialogContent>) => (
  <DialogContent className={cn("p-0 gap-0", className)} {...props} />
);

const SheetHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <DialogHeader className={cn("p-4", className)} {...props} />
);

const SheetFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <DialogFooter className={cn("p-4", className)} {...props} />
);

export const useResponsiveSheet = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return {
    isMobile,
    Container: isMobile ? Drawer : Dialog,
    Content: isMobile ? DrawerContent : SheetContent,
    Header: isMobile ? DrawerHeader : SheetHeader,
    Title: isMobile ? DrawerTitle : DialogTitle,
    Description: isMobile ? DrawerDescription : DialogDescription,
    Footer: isMobile ? DrawerFooter : SheetFooter,
    Close: isMobile ? DrawerClose : undefined,
  };
};
