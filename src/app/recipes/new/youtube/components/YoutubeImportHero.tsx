import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import type { YoutubeDict } from "@/shared/i18n";
import BetaBadge from "@/shared/ui/badge/BetaBadge";
import { Image } from "@/shared/ui/image/Image";

export const YoutubeImportHero = ({ dict }: { dict: YoutubeDict }) => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center pt-2 md:pt-12">
      <Image
        src={`${ICON_BASE_URL}youtube.webp`}
        alt="YouTube Premium"
        wrapperClassName="w-1/2"
        imgClassName="drop-shadow-xl"
      />
      <div className="mb-8 space-y-2 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-ink text-3xl font-extrabold md:text-4xl">
              {dict.heroTitle}
            </h1>
            <BetaBadge />
          </div>
          <p className="text-ink-muted text-lg">
            {dict.heroDescLead}
            <br />
            <span className="text-olive-light font-bold">
              {dict.heroDescHighlight}
            </span>
            {dict.heroDescTail}
          </p>
        </div>
      </div>
    </div>
  );
};
