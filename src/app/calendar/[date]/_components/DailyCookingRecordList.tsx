import type { UserPagesDict } from "@/shared/i18n";

import type { CookingRecordCalendarDateItem } from "@/entities/recipe";

import { DailyCookingRecordChips } from "./DailyCookingRecordChips";
import { DailyCookingRecordItem } from "./DailyCookingRecordItem";
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
  const { activeRecordId, registerRecordElement, selectRecord } =
    useDailyCookingRecordNavigation(records);

  return (
    <section aria-labelledby="daily-cooking-record-list-title">
      <div className="px-[18px] pt-6 pb-1">
        <h2
          id="daily-cooking-record-list-title"
          className="text-ink text-lg font-bold"
        >
          {copy.heading}
        </h2>
      </div>
      <DailyCookingRecordChips
        records={records}
        activeRecordId={activeRecordId}
        groupLabel={copy.chipGroupLabel}
        onSelect={selectRecord}
      />
      <div>
        {records.map((record, index) => (
          <DailyCookingRecordItem
            key={record.recordId}
            record={record}
            index={index}
            detailEnabled={detailEnabled}
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
