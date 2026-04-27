import { X } from "lucide-react";

import type { ChatQuota } from "../model/types";

import ChatQuotaBadge from "./ChatQuotaBadge";

type ChatHeaderProps = {
  quota: ChatQuota | undefined;
  onClose: () => void;
};

const ChatHeader = ({ quota, onClose }: ChatHeaderProps) => (
  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
    <div className="flex items-center gap-2">
      <h2 className="text-base font-bold text-gray-900">레시피 챗봇</h2>
      <ChatQuotaBadge quota={quota} />
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="챗봇 닫기"
      className="cursor-pointer rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
    >
      <X className="h-5 w-5" />
    </button>
  </div>
);

export default ChatHeader;
