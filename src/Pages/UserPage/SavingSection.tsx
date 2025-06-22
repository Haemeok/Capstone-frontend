import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

type SavingSectionProps = {
  imageUrl?: string;
  altText?: string;
};

const SavingSection = ({
  imageUrl = '',
  altText = '움직이는 아이템',
}: SavingSectionProps) => {
  const sectionContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const bobbingTweenRef = useRef<gsap.core.Tween | null>(null);

  const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!imageRef.current) {
        console.error('이미지 요소가 준비되지 않았습니다.');
        return;
      }

      gsap.set(imageRef.current, { opacity: 0, y: -30, scale: 0.9 });

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          setHasAnimatedOnce(true);
          if (imageRef.current) {
            bobbingTweenRef.current = gsap.to(imageRef.current, {
              y: '-=10',
              repeat: -1,
              yoyo: true,
              duration: 0.7,
              ease: 'sine.inOut',
              delay: 0.1,
            });
          }
        },
      });

      tl.to(imageRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      });

      introTimelineRef.current = tl;
      if (introTimelineRef.current) {
        introTimelineRef.current.play();
      }
    }, sectionContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionContainerRef}
      className="mx-auto flex w-fit max-w-sm flex-col items-center justify-center p-5"
    >
      <div className="flex h-44 w-44 items-center justify-center">
        <img
          ref={imageRef}
          src={imageUrl}
          alt={altText}
          className="max-h-full w-auto max-w-full object-contain"
        />
      </div>
    </div>
  );
};

export default SavingSection;
