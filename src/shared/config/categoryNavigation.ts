import type { TagCode } from "@/shared/config/constants/recipe";

export type CategoryIconConfig = {
  imageSrc: string;
  imageClassName?: string;
};

const CATEGORY_ICON_DEFINITIONS = {
  CHEF_RECIPE: {
    imageSrc: "/images/home-quick-nav/chef.png",
    imageClassName: "translate-x-[-4px] translate-y-[-4px]",
  },
  HOME_PARTY: {
    imageSrc: "/images/home-quick-nav/home-party.png",
  },
  BRUNCH: {
    imageSrc: "/images/home-quick-nav/brunch.png",
  },
  QUICK: {
    imageSrc: "/images/home-quick-nav/quick.png",
    imageClassName: "translate-x-[-3px] translate-y-[-5px]",
  },
  LATE_NIGHT: {
    imageSrc: "/images/home-quick-nav/late-night.png",
    imageClassName: "translate-x-[4px] translate-y-[-5px]",
  },
  LUNCHBOX: {
    imageSrc: "/images/home-quick-nav/lunchbox.png",
  },
  PICNIC: {
    imageSrc: "/images/home-quick-nav/picnic.png",
  },
  CAMPING: {
    imageSrc: "/images/home-quick-nav/camping.png",
  },
  HEALTHY: {
    imageSrc: "/images/home-quick-nav/diet.png",
    imageClassName: "translate-x-[-4px] translate-y-[-2px]",
  },
  KIDS: {
    imageSrc: "/images/home-quick-nav/kids.png",
    imageClassName: "translate-x-[4px] translate-y-[-3px]",
  },
  SOLO: {
    imageSrc: "/images/home-quick-nav/solo.png",
    imageClassName: "translate-y-[-3px]",
  },
  HOLIDAY: {
    imageSrc: "/images/home-quick-nav/holiday.png",
    imageClassName: "translate-x-[2px] translate-y-[5px]",
  },
  DRINK: {
    imageSrc: "/images/home-quick-nav/drink.png",
  },
  AIR_FRYER: {
    imageSrc: "/images/home-quick-nav/air-fryer.png",
    imageClassName: "translate-x-[6px] translate-y-[5px]",
  },
  HANGOVER: {
    imageSrc: "/images/home-quick-nav/hangover.png",
    imageClassName: "translate-x-[-3px] translate-y-[6px]",
  },
} satisfies Record<TagCode, CategoryIconConfig>;

export const CATEGORY_ICON_CONFIG: Readonly<
  Record<TagCode, CategoryIconConfig>
> = CATEGORY_ICON_DEFINITIONS;
