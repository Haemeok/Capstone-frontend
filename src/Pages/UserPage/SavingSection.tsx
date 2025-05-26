import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

type SavingSectionProps = {
  imageUrl?: string;
  altText?: string;
};

const SavingSection = ({
  imageUrl = '/Coffee.png',
  altText = '움직이는 아이템',
}: SavingSectionProps) => {
  const sectionContainerRef = useRef<HTMLDivElement | null>(null); // GSAP Context 범위용
  const imageRef = useRef<HTMLImageElement | null>(null); // 이미지 요소 참조

  // 애니메이션 타임라인 및 트윈 참조
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const bobbingTweenRef = useRef<gsap.core.Tween | null>(null);

  const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!imageRef.current) {
        console.error('이미지 요소가 준비되지 않았습니다.');
        return;
      }

      // --- 애니메이션 초기 상태 설정 ---
      // 이미지가 처음에는 투명하고, 약간 위쪽에, 살짝 작은 상태로 시작
      gsap.set(imageRef.current, { opacity: 0, y: -30, scale: 0.9 });

      // --- 인트로 (이미지 등장) 타임라인 ---
      const tl = gsap.timeline({
        paused: true, // 처음에는 정지된 상태
        onComplete: () => {
          setHasAnimatedOnce(true); // 첫 애니메이션 완료 표시
          // 이미지가 등장한 후 통통 튀는(bobbing) 애니메이션 시작
          if (imageRef.current) {
            bobbingTweenRef.current = gsap.to(imageRef.current, {
              y: '-=10', // 현재 위치에서 10px 위로 (튀는 높이 조절 가능)
              repeat: -1, // 무한 반복
              yoyo: true, // 위아래로 부드럽게 반복
              duration: 0.7, // 튀는 속도 조절 가능
              ease: 'sine.inOut', // 매우 부드러운 움직임
              delay: 0.1, // 등장 후 약간의 딜레이
            });
          }
        },
      });

      // 1. 이미지가 "사르르 등장"하는 애니메이션
      tl.to(imageRef.current, {
        opacity: 1, // 완전히 보이게
        y: 0, // 원래 y 위치로
        scale: 1, // 원래 크기로
        duration: 0.8, // 등장 애니메이션 지속 시간
        ease: 'power2.out', // 부드럽게 나타나는 효과
      });

      introTimelineRef.current = tl;
      if (introTimelineRef.current) {
        introTimelineRef.current.play(); // 또는 .restart()
      }
    }, sectionContainerRef); // 애니메이션 스코프를 sectionContainerRef 내부로 지정

    // 클린업 함수: 컴포넌트 언마운트 시 GSAP 컨텍스트에 포함된 모든 애니메이션 정리
    return () => ctx.revert();
  }, []); // 빈 의존성 배열: 마운트 시 1회 실행 및 언마운트 시 클린업

  const handleAnimate = () => {
    // 기존에 실행 중인 bobbing 애니메이션이 있다면 중지 및 제거
    if (bobbingTweenRef.current) {
      bobbingTweenRef.current.kill();
      bobbingTweenRef.current = null; // 참조도 초기화
    }

    // 인트로 타임라인을 재시작하기 전에 이미지의 상태를 명시적으로 초기화
    if (imageRef.current) {
      gsap.set(imageRef.current, { opacity: 0, y: -30, scale: 0.9 });
    }

    if (introTimelineRef.current) {
      introTimelineRef.current.restart();
    }
  };

  return (
    <div
      ref={sectionContainerRef}
      className="mx-auto flex w-fit max-w-sm flex-col items-center justify-center p-5"
    >
      <div className="flex h-36 w-36 items-center justify-center">
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
