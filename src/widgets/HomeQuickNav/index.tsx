import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { type HomeDict, type Locale, localizedHref } from "@/shared/i18n";
import { Image } from "@/shared/ui/image/Image";

import { HOME_QUICK_NAV_ITEMS, HOME_TREND_RECIPES_HREF } from "./config";

type HomeQuickNavProps = {
  locale: Locale;
  messages: HomeDict["quickNav"];
};

const HomeQuickNav = ({ locale, messages }: HomeQuickNavProps) => (
  <nav
    aria-label={messages.ariaLabel}
    className="w-full border-b-[8px] border-gray-100 bg-white pt-[18px]"
  >
    <ul className="grid w-full grid-cols-5 gap-x-1 gap-y-3.5 px-1 pb-[18px] md:grid-cols-10 md:gap-y-0 md:px-3">
      {HOME_QUICK_NAV_ITEMS.map((item) => {
        const label = messages.items[item.id];
        const compactLabel =
          item.id === "chef" || item.id === "youtube"
            ? messages.compactItems[item.id]
            : undefined;

        return (
          <li key={item.id} className="min-w-0">
            <Link
              href={localizedHref(item.href, locale)}
              aria-label={label}
              className="focus-visible:ring-olive-light flex min-h-11 cursor-pointer flex-col items-center justify-start gap-1.5 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <span
                data-icon-badge="true"
                className="flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-gray-100 transition-colors active:bg-gray-200"
              >
                <Image
                  src={item.imageSrc}
                  alt=""
                  width={60}
                  height={60}
                  lazy={false}
                  fit="contain"
                  wrapperClassName="h-[60px] w-[60px] bg-transparent"
                  skeletonClassName="bg-transparent"
                  imgClassName={item.isYoutube ? "p-2.5" : "p-0.5"}
                />
              </span>
              <span
                aria-hidden="true"
                className="text-ink max-w-full text-[11.5px] leading-[1.3] font-medium tracking-[-0.04em] whitespace-nowrap max-[340px]:text-[10px]"
              >
                {compactLabel ? (
                  <>
                    <span className="max-[340px]:hidden">{label}</span>
                    <span
                      data-compact-label
                      className="hidden max-[340px]:inline"
                    >
                      {compactLabel}
                    </span>
                  </>
                ) : (
                  label
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>

    <Link
      href={localizedHref(HOME_TREND_RECIPES_HREF, locale)}
      className="text-ink flex min-h-13 w-full cursor-pointer items-center justify-center gap-1 border-t border-gray-200 px-4 text-[15px] font-medium no-underline transition-colors active:bg-gray-50"
    >
      <span>{messages.trendMore}</span>
      <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
    </Link>
  </nav>
);

export default HomeQuickNav;
