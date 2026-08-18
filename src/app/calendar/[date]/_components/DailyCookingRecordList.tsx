import type { UserPagesDict } from "@/shared/i18n";
import { format, useUserPagesLocale } from "@/shared/i18n";

import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

import { DailyCookingRecordChips } from "./DailyCookingRecordChips";
import { DailyCookingRecordItem } from "./DailyCookingRecordItem";
import { getDailyCookingRecordLabels } from "./dailyCookingRecordLabels";
import { useDailyCookingRecordNavigation } from "./useDailyCookingRecordNavigation";

type DailyCookingRecordListProps = {
  records: CookingRecordCalendarDateItem[];
  detailEnabled: boolean;
  copy: UserPagesDict["calendar"]["dailyRecord"]["list"];
};

export const DailyCookingRecordList = ({
  records,
  detailEnabled,
  copy,
}: DailyCookingRecordListProps) => {
  const locale = useUserPagesLocale();
  const labels = getDailyCookingRecordLabels(locale);
  const { activeRecordId, registerRecordElement, selectRecord } =
    useDailyCookingRecordNavigation(records);

  return (
    <section aria-labelledby="daily-cooking-record-list-title">
      <div className="z-sticky sticky top-[47px] bg-white/95 backdrop-blur-sm">
        <div className="px-[18px] py-2">
          <h2
            id="daily-cooking-record-list-title"
            className="text-ink text-lg font-bold"
          >
            {copy.heading}
            <span aria-hidden="true">
              {" · "}
              {format(labels.recordCount, { count: records.length })}
            </span>
          </h2>
        </div>
        <DailyCookingRecordChips
          records={records}
          activeRecordId={activeRecordId}
          groupLabel={copy.chipGroupLabel}
          onSelect={selectRecord}
        />
      </div>
      <div>
        {records.map((record, index) => (
          <DailyCookingRecordItem
            key={record.recordId}
            record={record}
            index={index}
            detailEnabled={detailEnabled}
            manualSourceLabel={labels.manualSource}
            copy={copy}
            onElementChange={(element) =>
              registerRecordElement(record.recordId, element)
            }
          />
        ))}
      </div>
    </section>
  );
};
