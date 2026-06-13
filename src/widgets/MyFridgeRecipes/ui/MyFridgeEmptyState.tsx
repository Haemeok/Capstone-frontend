import Link from "next/link";

import { Refrigerator } from "lucide-react";

import { useFridgeDict } from "@/shared/i18n";
import { Button } from "@/shared/ui/shadcn/button";

const MyFridgeEmptyState = () => {
  const dict = useFridgeDict();

  return (
    <div className="flex flex-col items-center gap-5 px-6 pt-16 pb-12">
      <Refrigerator
        className="h-20 w-20 text-gray-300"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="space-y-2 text-center">
        <h3 className="text-ink text-xl font-bold">{dict.emptyHeading}</h3>
        <p className="text-ink-muted text-sm">
          {dict.emptyBodyLine1}
          <br />
          {dict.emptyBodyLine2}
        </p>
      </div>
      <Link href="/ingredients/new">
        <Button className="bg-olive-light active:bg-olive-light/90 mt-2 h-12 cursor-pointer rounded-xl px-6 font-medium text-white transition-colors">
          {dict.emptyCta}
        </Button>
      </Link>
    </div>
  );
};

export default MyFridgeEmptyState;
