"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "./shadcn/button";
import { CardContent } from "./shadcn/card";
import { Collapsible, CollapsibleTrigger } from "./shadcn/collapsible";

type CollapsiblePProps = {
  content: string;
};

const MAX_COLLAPSED_HEIGHT_PX = 96;

const CollapsibleP = ({ content }: CollapsiblePProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const currentContentHeight = contentRef.current.scrollHeight;
      if (currentContentHeight > MAX_COLLAPSED_HEIGHT_PX) {
        setShowButton(true);
      } else {
        setShowButton(false);
        setIsOpen(true);
      }
    }
  }, [content]);

  const showGradient = showButton && !isOpen;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={showButton ? setIsOpen : undefined}
    >
      <CardContent className="p-4">
        <div
          className="prose prose-sm relative w-full max-w-none"
          style={{
            height: !showButton || isOpen ? "auto" : "100px",
            transition: showButton ? "height 0.3s ease-in-out" : "none",
          }}
        >
          <div
            className={`${
              !showButton || isOpen ? "" : "max-h-24 overflow-hidden"
            }`}
          >
            <p ref={contentRef} className="mb-2 break-words">
              {content}
            </p>
          </div>

          {showGradient && (
            <div className="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>

        {showButton && (
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 font-bold text-[#526c04]"
            >
              {isOpen ? (
                <>
                  숨기기 <ChevronUp size={16} className="ml-1" />
                </>
              ) : (
                <>
                  더 읽기 <ChevronDown size={16} className="ml-1" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        )}
      </CardContent>
    </Collapsible>
  );
};

export default CollapsibleP;
