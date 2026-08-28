import type { HomeDict } from "@/shared/i18n";
import YouTubeIconBadge from "@/shared/ui/badge/YouTubeIconBadge";

import { DesktopYoutubeImportLauncher } from "./DesktopYoutubeImportLauncher";
import { DesktopYoutubeTransformPreview } from "./DesktopYoutubeTransformPreview";

type DesktopYoutubeImportHeroProps = {
  messages: HomeDict["desktopYoutubeImport"];
};

export const DesktopYoutubeImportHero = ({
  messages,
}: DesktopYoutubeImportHeroProps) => {
  const copy = (
    <>
      <div className="text-ink-sub flex items-center gap-2 text-sm font-semibold">
        <YouTubeIconBadge className="h-5 w-5" />
        <span>{messages.eyebrow}</span>
      </div>
      <h1 className="text-ink mt-4 text-[38px] leading-[1.14] font-bold tracking-[-0.05em] lg:text-[42px]">
        <span className="block">{messages.titleLine1}</span>
        <span className="block">{messages.titleLine2}</span>
      </h1>
      <p className="text-ink-sub mt-5 text-base leading-6">
        {messages.description}
      </p>
    </>
  );

  return (
    <section
      data-testid="desktop-youtube-import-hero"
      aria-label={messages.ariaLabel}
      className="hidden w-full bg-[#f4f8f2] md:block"
    >
      <DesktopYoutubeImportLauncher
        messages={messages}
        copy={copy}
        initialPreview={<DesktopYoutubeTransformPreview messages={messages} />}
      />
    </section>
  );
};
