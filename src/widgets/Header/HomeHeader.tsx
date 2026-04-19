"use client";

import { useRouter } from "next/navigation";

import { SearchInput } from "@/features/search-input";

import NotificationButton from "./NotificationButton";
import SavedRecipeBooksButton from "./SavedRecipeBooksButton";

const HomeHeader = () => {
  const router = useRouter();

  const handleSearchFocus = () => {
    router.push("/search?focused=1", { scroll: false });
  };

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-4 flex w-full flex-col items-center bg-white px-4 pt-4 pb-2 md:hidden">
      <div className="flex w-full items-center gap-1">
        <div className="min-w-0 flex-1">
          <SearchInput onFocus={handleSearchFocus} />
        </div>
        <NotificationButton />
        <SavedRecipeBooksButton />
      </div>
    </div>
  );
};

export default HomeHeader;
