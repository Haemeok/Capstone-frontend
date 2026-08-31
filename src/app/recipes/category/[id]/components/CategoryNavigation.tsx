"use client";

import { motion } from "framer-motion";

import { CATEGORY_ICON_CONFIG } from "@/shared/config/categoryNavigation";
import {
  TAG_DEFINITIONS,
  type TagCode,
} from "@/shared/config/constants/recipe";
import { LocalizedLink } from "@/shared/i18n";
import { useCategoryDict } from "@/shared/i18n/useCategoryDict";
import { useTaxonomy } from "@/shared/i18n/useTaxonomy";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { useCategoryNavigation } from "./useCategoryNavigation";

type CategoryNavigationProps = {
  currentCode: TagCode;
};

const CATEGORY_NAV_ITEM_PITCH_PX = 70;

const getRotatedCategoryDefinitions = (currentCode: TagCode) => {
  const currentIndex = TAG_DEFINITIONS.findIndex(
    ({ code }) => code === currentCode
  );

  return [
    ...TAG_DEFINITIONS.slice(currentIndex),
    ...TAG_DEFINITIONS.slice(0, currentIndex),
  ];
};

const CategoryNavigation = ({ currentCode }: CategoryNavigationProps) => {
  const dict = useCategoryDict();
  const { label } = useTaxonomy();
  const {
    activeCode,
    scrollerRef,
    hasHiddenItemsRight,
    handleScroll,
    handleSelect,
    indicatorTransition,
  } = useCategoryNavigation(currentCode);
  const orderedCategories = getRotatedCategoryDefinitions(currentCode);
  const activeIndex = orderedCategories.findIndex(
    ({ code }) => code === activeCode
  );

  return (
    <nav
      aria-label={dict.navAriaLabel}
      className="relative border-b border-gray-100"
    >
      <div
        ref={scrollerRef}
        data-testid="category-scroller"
        onScroll={handleScroll}
        className="scrollbar-hide overflow-x-auto overscroll-x-contain px-3"
      >
        <div className="relative w-max">
          <ul className="flex w-max gap-0.5 py-2">
            {orderedCategories.map((tag) => {
              const isRouteCurrent = tag.code === currentCode;
              const isVisuallyActive = tag.code === activeCode;
              const iconConfig = CATEGORY_ICON_CONFIG[tag.code];

              return (
                <li
                  key={tag.code}
                  data-category-code={tag.code}
                  className="w-[68px] shrink-0"
                >
                  <LocalizedLink
                    href={`/recipes/category/${tag.code}`}
                    aria-current={isRouteCurrent ? "page" : undefined}
                    onClick={(event) => handleSelect(tag.code, event)}
                    className="focus-visible:ring-olive-light relative flex min-h-[74px] cursor-pointer flex-col items-center rounded-xl px-1 pt-0.5 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span
                      data-testid="category-icon-shell"
                      className="flex h-11 w-11 items-center justify-center overflow-visible"
                    >
                      <Image
                        src={iconConfig.imageSrc}
                        alt=""
                        fit="contain"
                        wrapperClassName="h-11 w-11 bg-transparent"
                        skeletonClassName="rounded-none bg-transparent"
                        imgClassName={cn("p-0.5", iconConfig.imageClassName)}
                      />
                    </span>
                    <span
                      className={cn(
                        "mt-1 max-w-[66px] truncate text-center text-xs leading-4 whitespace-nowrap",
                        isVisuallyActive
                          ? "text-ink font-bold"
                          : "text-ink-sub font-medium"
                      )}
                    >
                      {label(tag.code, "tags")}
                    </span>
                  </LocalizedLink>
                </li>
              );
            })}
          </ul>
          <motion.span
            data-category-indicator
            aria-hidden="true"
            initial={false}
            animate={{ x: activeIndex * CATEGORY_NAV_ITEM_PITCH_PX }}
            transition={indicatorTransition}
            className="pointer-events-none absolute bottom-0 left-2 h-[3px] w-[52px] rounded-full bg-black"
          />
        </div>
      </div>
      {hasHiddenItemsRight ? (
        <div
          data-testid="category-fade"
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white/85 to-transparent"
        />
      ) : null}
    </nav>
  );
};

export default CategoryNavigation;
