type SummaryMetric = {
  value: string;
  label: string;
};

type MonthlyCookingRecordSummaryProps = {
  ariaLabel: string;
  title: string;
  cookingDays: SummaryMetric;
  savings: SummaryMetric;
  uniqueDishes: SummaryMetric;
};

export const MonthlyCookingRecordSummary = ({
  ariaLabel,
  title,
  cookingDays,
  savings,
  uniqueDishes,
}: MonthlyCookingRecordSummaryProps) => (
  <section aria-label={ariaLabel} className="bg-white px-5 pt-3.5 pb-4.5">
    <h2 className="text-ink text-[22px] leading-[1.35] font-bold tracking-[-0.035em]">
      {title}
    </h2>
    <dl className="mt-4 grid grid-cols-3 gap-2.5">
      <SummaryMetricItem metric={cookingDays} />
      <SummaryMetricItem metric={savings} />
      <SummaryMetricItem metric={uniqueDishes} />
    </dl>
  </section>
);

const SummaryMetricItem = ({ metric }: { metric: SummaryMetric }) => (
  <div className="flex min-w-0 flex-col">
    <dt className="text-ink-muted order-2 mt-0.5 text-xs leading-4">
      {metric.label}
    </dt>
    <dd className="text-ink order-1 truncate text-[17px] leading-6 font-bold tracking-[-0.02em]">
      {metric.value}
    </dd>
  </div>
);
