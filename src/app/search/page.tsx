import { Suspense } from "react";

import { SearchDiscoveryClient } from "@/widgets/SearchDiscovery";

export const metadata = {
  title: "레시피 탐색 - 레시피오",
  description: "다양한 레시피를 탐색하고 발견하세요.",
};

export default function SearchPage() {
  return (
    <Suspense>
      <SearchDiscoveryClient />
    </Suspense>
  );
}
