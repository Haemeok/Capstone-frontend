"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useScrollContext } from "@/shared/lib/ScrollContext";

const HEADER_OFFSET_PX = 88;
const PROGRAMMATIC_SCROLL_LOCK_MS = 500;

type UseActiveSectionReturn = {
  activeId: string | null;
  scrollToSection: (id: string) => void;
};

export const useActiveSection = (
  sectionIds: string[]
): UseActiveSectionReturn => {
  const { motionRef } = useScrollContext();
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds[0] ?? null
  );
  const isProgrammaticScrollRef = useRef(false);
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Docusaurus 패턴: scroll event + getBoundingClientRect
  useEffect(() => {
    if (sectionIds.length === 0) return;
    const container = motionRef.current;
    if (!container) return;

    const updateActiveSection = () => {
      if (isProgrammaticScrollRef.current) return;

      const containerRect = container.getBoundingClientRect();

      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      if (elements.length === 0) return;

      // 헤더 오프셋 아래에 있는 첫 번째 섹션 찾기
      const nextSection = elements.find((el) => {
        const rect = el.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        return relativeTop >= HEADER_OFFSET_PX;
      });

      if (nextSection) {
        const rect = nextSection.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        const containerHalf = container.clientHeight / 2;

        if (relativeTop < containerHalf) {
          // 화면 상단 절반에 있음 → 이 섹션이 active
          setActiveId(nextSection.id);
        } else {
          // 하단 절반에 있음 → 이전 섹션이 아직 읽히는 중
          const idx = elements.indexOf(nextSection);
          const prev = elements[idx - 1];
          setActiveId(prev ? prev.id : sectionIds[0]);
        }
      } else {
        // 모든 섹션이 위로 스크롤됨 → 마지막 섹션 활성화
        setActiveId(sectionIds[sectionIds.length - 1]);
      }
    };

    container.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    updateActiveSection();

    return () => container.removeEventListener("scroll", updateActiveSection);
  }, [sectionIds, motionRef]);

  // 클릭 시 optimistic update + 트래킹 잠금
  const scrollToSection = useCallback(
    (id: string) => {
      isProgrammaticScrollRef.current = true;
      setActiveId(id);

      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
      lockTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, PROGRAMMATIC_SCROLL_LOCK_MS);

      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [sectionIds]
  );

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  return { activeId, scrollToSection };
};
