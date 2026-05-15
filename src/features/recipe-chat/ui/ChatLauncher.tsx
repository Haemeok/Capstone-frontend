"use client";

import { useState } from "react";

import { useUserStore } from "@/entities/user/model/store";

import ChatDrawer from "./ChatDrawer";
import ChatFloatingButton from "./ChatFloatingButton";
import ChatOnboardingBubble from "./ChatOnboardingBubble";

type ChatLauncherProps = {
  recipeId: string;
};

const ChatLauncher = ({ recipeId }: ChatLauncherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useUserStore();

  const open = () => setIsOpen(true);

  return (
    <>
      <ChatFloatingButton onClick={open} />
      <ChatOnboardingBubble
        onClick={open}
        isOpen={isOpen}
        isAuthenticated={isAuthenticated}
      />
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
