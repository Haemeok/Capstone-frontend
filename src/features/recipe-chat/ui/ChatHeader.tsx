import { X } from "lucide-react";

import { Image } from "@/shared/ui/image/Image";

import type { ChatQuota } from "../model/types";

import ChatQuotaBadge from "./ChatQuotaBadge";

type ChatHeaderProps = {
  quota: ChatQuota | undefined;
  onClose: () => void;
};

const ChatHeader = ({ quota, onClose }: ChatHeaderProps) => (
  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
    <div className="flex items-center gap-2.5">
      <Image
        src="/web-app-manifest-192x192.png"
        alt="Recipio"
        width={32}
        wrapperClassName="shrink-0 rounded-lg"
      />
      <div className="flex items-center gap-1.5">
        <h2 className="text-[17px] font-bold text-gray-900">레시피오 AI</h2>
        <span className="inline-flex items-center rounded-md border border-gray-200 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-gray-500">
          BETA
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <ChatQuotaBadge quota={quota} />
      <button
        type="button"
        onClick={onClose}
        aria-label="챗봇 닫기"
        className="cursor-pointer rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  </div>
);

export default ChatHeader;
