import { MonthlyCookingRecordSharePreview } from "./MonthlyCookingRecordSharePreview";
import { MonthlyCookingRecordShareStatus } from "./MonthlyCookingRecordShareStatus";
import type {
  MonthlyCookingRecordCopy,
  MonthlyCookingRecordShareRecords,
} from "./sharePage.types";

type MonthlyCookingRecordShareDataProps = {
  monthKey: string;
  monthLabel: string;
  copy: MonthlyCookingRecordCopy;
  records: MonthlyCookingRecordShareRecords;
};

export const MonthlyCookingRecordShareData = ({
  monthKey,
  monthLabel,
  copy,
  records,
}: MonthlyCookingRecordShareDataProps) => {
  const stateCopy = copy.share.state;
  if (records.isError) {
    return (
      <MonthlyCookingRecordShareStatus
        title={stateCopy.errorTitle}
        description={stateCopy.errorDescription}
        actionLabel={stateCopy.retry}
        onAction={() => void records.retry()}
      />
    );
  }
  if (!records.isReady || records.isPending) {
    return <MonthlyCookingRecordShareStatus description={stateCopy.loading} />;
  }
  if (records.totalCount === 0) {
    return (
      <MonthlyCookingRecordShareStatus
        title={stateCopy.emptyTitle}
        description={stateCopy.emptyDescription}
      />
    );
  }
  return (
    <MonthlyCookingRecordSharePreview
      monthKey={monthKey}
      monthLabel={monthLabel}
      copy={copy}
      records={records}
    />
  );
};
