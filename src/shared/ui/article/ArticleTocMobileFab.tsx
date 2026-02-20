"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ListIcon } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import type { TocItem } from "./types";
import ArticleTocList from "./ArticleTocList";

type ArticleTocMobileFabProps = {
  items: TocItem[];
  activeId: string | null;
  onScrollToSection: (id: string) => void;
};

const ArticleTocMobileFab = ({
  items,
  activeId,
  onScrollToSection,
}: ArticleTocMobileFabProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFabClick = () => {
    triggerHaptic("Light");
    setIsOpen(true);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-10 md:hidden">
        <AnimatePresence>
          <motion.button
            onClick={handleFabClick}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white shadow-lg active:scale-95"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            aria-label="목차 열기"
          >
            <ListIcon size={20} className="text-gray-700" />
          </motion.button>
        </AnimatePresence>
      </div>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="rounded-t-3xl border-0 bg-white shadow-xl">
          <DrawerHeader className="px-6 pb-2 pt-6">
            <DrawerTitle className="text-xl font-bold text-gray-900">
              목차
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <ArticleTocList
              items={items}
              activeId={activeId}
              onScrollToSection={onScrollToSection}
              onItemClick={handleItemClick}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ArticleTocMobileFab;
