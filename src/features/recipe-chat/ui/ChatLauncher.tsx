"use client";

import { useState } from "react";

import ChatDrawer from "./ChatDrawer";
import ChatFloatingButton from "./ChatFloatingButton";

type ChatLauncherProps = {
  recipeId: string;
};

const ChatLauncher = ({ recipeId }: ChatLauncherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatFloatingButton onClick={() => setIsOpen(true)} />
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
