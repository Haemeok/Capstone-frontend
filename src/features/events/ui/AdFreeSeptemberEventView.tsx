import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";

import AdFreeReferralCta from "./AdFreeReferralCta";
import EventFAQ from "./EventFAQ";
import EventPageShell from "./EventPageShell";
import EventSection from "./EventSection";

export const AdFreeSeptemberEventView = ({ locale }: { locale: Locale }) => {
  const t = getDictionary(locale).events;
  const campaign = t.adFreeSeptember;

  return (
    <EventPageShell
      title={campaign.headerTitle}
      heroSrc="/events/ad-free-september/hero.png"
      heroAlt={campaign.heroAlt}
    >
      <EventSection
        label={campaign.event1.label}
        title={campaign.event1.title}
        align="center"
      >
        <p className="text-ink-sub text-base leading-7">
          {campaign.event1.body}
        </p>
      </EventSection>
      <EventSection
        label={campaign.event2.label}
        title={campaign.event2.title}
        align="center"
      >
        <p className="text-ink-sub text-base leading-7">
          {campaign.event2.body}
        </p>
      </EventSection>
      <div className="px-5 pb-2">
        <AdFreeReferralCta locale={locale} />
      </div>
      <EventFAQ heading={t.faqHeading} items={campaign.faq} />
    </EventPageShell>
  );
};
