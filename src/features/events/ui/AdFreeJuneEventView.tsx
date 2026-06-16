import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";

import AdFreeReferralCta from "./AdFreeReferralCta";
import EventFAQ from "./EventFAQ";
import EventPageShell from "./EventPageShell";
import EventSection from "./EventSection";

export const AdFreeJuneEventView = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).events;
  const a = t.adFreeJune;

  return (
    <EventPageShell
      title={a.headerTitle}
      heroSrc="/events/ad-free-june/hero.png"
      heroAlt={a.heroAlt}
    >
      <EventSection
        label={a.event1.label}
        title={a.event1.title}
        align="center"
      >
        <p className="text-ink-sub text-base leading-7">{a.event1.body}</p>
      </EventSection>
      <EventSection
        label={a.event2.label}
        title={a.event2.title}
        align="center"
      >
        <p className="text-ink-sub text-base leading-7">{a.event2.body}</p>
      </EventSection>
      <div className="px-5 pb-2">
        <AdFreeReferralCta locale={locale} />
      </div>
      <EventFAQ heading={t.faqHeading} items={a.faq} />
    </EventPageShell>
  );
};
