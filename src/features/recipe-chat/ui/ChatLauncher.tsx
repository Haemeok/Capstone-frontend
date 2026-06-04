"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import ChatFloatingButton from "./ChatFloatingButton";

const ChatDrawer = dynamic(() => import("./ChatDrawer"), { ssr: false });

type ChatLauncherProps = {
  recipeId: string;
};

const ChatLauncher = ({ recipeId }: ChatLauncherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  return (
    <>
      <ChatFloatingButton onClick={open} />
      {isOpen && (
        <ChatDrawer
          recipeId={recipeId}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
};

export default ChatLauncher;
