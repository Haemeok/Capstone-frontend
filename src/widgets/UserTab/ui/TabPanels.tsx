"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import useEmblaCarousel from "embla-carousel-react";

type TabPanel = {
  id: string;
  content: ReactNode;
};

type TabPanelsProps = {
  panels: TabPanel[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

const IDLE_PREMOUNT_TIMEOUT_MS = 1500;

const useIdlePremount = () => {
  const [isPremounted, setIsPremounted] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(() => setIsPremounted(true), {
        timeout: IDLE_PREMOUNT_TIMEOUT_MS,
      });
      return () => cancelIdleCallback(id);
    }

    const timer = setTimeout(
      () => setIsPremounted(true),
      IDLE_PREMOUNT_TIMEOUT_MS
    );
    return () => clearTimeout(timer);
  }, []);

  return isPremounted;
};

export const TabPanels = ({
  panels,
  activeIndex,
  onActiveIndexChange,
}: TabPanelsProps) => {
  const canSwipe = panels.length > 1;
  // startIndex가 렌더마다 바뀌면 어댑터가 옵션 변경으로 보고 reInit → 스냅 애니메이션이 끊긴다
  const [initialIndex] = useState(activeIndex);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    watchDrag: canSwipe,
  });
  const isPremounted = useIdlePremount();
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      onActiveIndexChange(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onActiveIndexChange]);

  useEffect(() => {
    if (!emblaApi) return;
    if (emblaApi.selectedScrollSnap() !== activeIndex) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [emblaApi, activeIndex]);

  const setSlideRef = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      slideRefs.current[index] = node;
    },
    []
  );

  useEffect(() => {
    const slide = slideRefs.current[activeIndex];
    if (!slide || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      setHeight(slide.offsetHeight);
    });
    observer.observe(slide);
    setHeight(slide.offsetHeight);
    return () => observer.disconnect();
  }, [activeIndex, isPremounted]);

  if (!canSwipe) {
    return <>{panels[0]?.content}</>;
  }

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div
        className="flex items-start transition-[height] duration-300 ease-out"
        style={height != null ? { height } : undefined}
      >
        {panels.map((panel, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={panel.id}
              ref={setSlideRef(index)}
              aria-hidden={!isActive}
              inert={!isActive}
              className="min-w-0 flex-[0_0_100%]"
            >
              {(isPremounted || isActive) && panel.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
