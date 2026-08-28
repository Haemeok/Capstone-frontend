import { Image } from "@/shared/ui/image/Image";

import type { ChatQuota } from "../model/types";
import ChatQuotaBadge from "./ChatQuotaBadge";

type ChatHeaderProps = {
  quota: ChatQuota | undefined;
};

const ChatHeader = ({ quota }: ChatHeaderProps) => (
  <div className="flex items-center justify-between border-b border-gray-100 py-3.5 pr-16 pl-5">
    <div className="flex items-center gap-2.5">
      <Image
        src="/web-app-manifest-192x192.png"
        alt="Recipio"
        width={32}
        wrapperClassName="shrink-0 rounded-lg"
      />
      <div className="flex items-center gap-1.5">
        <h2 className="text-ink text-[17px] font-bold">레시피오 AI</h2>
        <span className="text-ink-muted inline-flex items-center rounded-md border border-gray-200 px-1.5 py-0.5 text-[10px] font-bold tracking-wide">
          BETA
        </span>
      </div>
    </div>
    <ChatQuotaBadge quota={quota} />
  </div>
);

export default ChatHeader;
