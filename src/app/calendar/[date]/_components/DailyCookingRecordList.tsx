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
      <div className="z-sticky sticky-optimized sticky top-12 bg-white/95 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-white/95 before:backdrop-blur-sm before:content-['']">
        <div className="px-[18px] py-2">
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
      </div>
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
