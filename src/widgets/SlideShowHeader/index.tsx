"use client";

import { useRouter } from "next/navigation";

import { Share, X } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";
import { useShare } from "@/shared/hooks/useShare";

type SlideShowHeaderProps = {
  title?: string;
  text?: string;
};

const SlideShowHeader = ({ title, text }: SlideShowHeaderProps) => {
  const router = useRouter();
  const { share } = useShare();

  const handleShare = () => {
    share({ title, text });
  };

  return (
    <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={() => router.back()}
      >
        <X className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={handleShare}
      >
        <Share className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SlideShowHeader;