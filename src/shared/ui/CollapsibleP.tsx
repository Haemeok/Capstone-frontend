"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { useCommonDict } from "@/shared/i18n";

import { cn } from "../lib/utils";
import { Button } from "./shadcn/button";
import { CardContent } from "./shadcn/card";
import { Collapsible, CollapsibleTrigger } from "./shadcn/collapsible";

type CollapsiblePProps = {
  content?: string;
  height?: number;
  gradientHeight?: number;
  className?: string;
};

const CollapsibleP = ({
  content = "",
  height = 96,
  gradientHeight = 64,
  className,
}: CollapsiblePProps) => {
  const t = useCommonDict();
  const [isOpen, setIsOpen] = useState(false);
  const [contentScrollHeight, setContentScrollHeight] = useState(0);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentScrollHeight(contentRef.current.scrollHeight);
    }
  }, [content, height]);

  const showButton = contentScrollHeight > height;
  const showGradient = showButton && !isOpen;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={showButton ? setIsOpen : undefined}
    >
      <CardContent className={cn("p-4", className)}>
        <div
          className="relative w-full"
          style={{
            height: !showButton || isOpen ? "auto" : `${height}px`,
            transition: showButton ? "height 0.3s ease-in-out" : "none",
          }}
        >
          <div
            className={!showButton || isOpen ? "" : "overflow-hidden"}
            style={{
              maxHeight: !showButton || isOpen ? "none" : `${height}px`,
            }}
          >
            <p
              ref={contentRef}
              className="mb-2 break-words whitespace-pre-wrap"
            >
              {content}
            </p>
          </div>

          {showGradient && (
            <div
              className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-white to-transparent"
              style={{ height: `${gradientHeight}px` }}
            ></div>
          )}
        </div>

        {showButton && (
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-olive-light mt-2 font-bold"
              aria-label={isOpen ? t.collapseAria : t.readMoreAria}
            >
              {isOpen ? (
                <>
                  {t.collapse}{" "}
                  <ChevronUp
                    size={16}
                    className="ml-1 cursor-pointer"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <>
                  {t.readMore}{" "}
                  <ChevronDown
                    size={16}
                    className="ml-1 cursor-pointer"
                    aria-hidden="true"
                  />
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
