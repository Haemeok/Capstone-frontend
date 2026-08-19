import { Suspense } from "react";

import { MonthlyCookingRecordPageClient } from "./_components/MonthlyCookingRecordPageClient";

const CookingRecordPage = () => (
  <Suspense fallback={null}>
    <MonthlyCookingRecordPageClient />
  </Suspense>
);

export default CookingRecordPage;
