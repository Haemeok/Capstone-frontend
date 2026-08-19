import { Suspense } from "react";

import { MonthlyCookingRecordSharePageClient } from "./_components/MonthlyCookingRecordSharePageClient";

const MonthlyCookingRecordSharePage = () => (
  <Suspense fallback={null}>
    <MonthlyCookingRecordSharePageClient />
  </Suspense>
);

export default MonthlyCookingRecordSharePage;
