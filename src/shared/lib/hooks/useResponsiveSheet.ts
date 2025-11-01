import { useMediaQuery } from "./useMediaQuery";
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

export const useResponsiveSheet = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return {
    isMobile,
    Container: isMobile ? Drawer : Dialog,
    Content: isMobile ? DrawerContent : DialogContent,
    Header: isMobile ? DrawerHeader : DialogHeader,
    Title: isMobile ? DrawerTitle : DialogTitle,
    Description: isMobile ? DrawerDescription : DialogDescription,
    Footer: isMobile ? DrawerFooter : DialogFooter,
    Close: isMobile ? DrawerClose : undefined,
  };
};
