import React, { useRef, useEffect, useState } from "react";

type TransformingNavbarProps = {
  title: string;

  targetRef: React.RefObject<HTMLElement | null>;

  leftComponent?: React.ReactNode;

  rightComponent?: React.ReactNode;

  titleThreshold?: number;

  textColorThreshold?: number;

  shadowThreshold?: number;
};

const TransformingNavbar = ({
  title,
  targetRef,
  leftComponent,
  rightComponent,
  titleThreshold = 0.7,
  textColorThreshold = 0.5,
  shadowThreshold = 0.8,
}: TransformingNavbarProps) => {
  // 상태 관리
  const [navOpacity, setNavOpacity] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  // 네비게이션 바 ref
  const headerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer 설정
  useEffect(() => {
    if (!targetRef.current) return;

    // 임계값 배열 - 부드러운 전환을 위해 여러 지점 설정
    const thresholds = Array.from({ length: 20 }, (_, i) => i / 20);

    // 관찰 대상 요소 감시 옵저버
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // 요소의 가시성 비율에 따른 opacity 계산
        // 요소가 위로 스크롤될수록 navOpacity 증가
        const visibleRatio =
          1 - Math.max(0, Math.min(1, entry.intersectionRatio * 1.5));
        setNavOpacity(visibleRatio);

        // 특정 임계값에서 제목 표시 토글
        setShowTitle(visibleRatio > titleThreshold);

        // 헤더 색상 트랜지션을 위한 CSS 변수 설정
        if (headerRef.current) {
          headerRef.current.style.setProperty(
            "--nav-opacity",
            visibleRatio.toString(),
          );
        }
      },
      {
        threshold: thresholds,
        rootMargin: "-10% 0px 0px 0px", // 상단에서 10% 아래부터 감지 시작
      },
    );

    // 관찰 대상 요소 감시 시작
    observer.observe(targetRef.current);

    // 클린업
    return () => {
      observer.disconnect();
    };
  }, [targetRef, titleThreshold]);

  // 네비게이션 텍스트 컬러 계산
  const textColor =
    navOpacity > textColorThreshold ? "text-black" : "text-white";

  // 기본 컴포넌트 제공
  const defaultLeftComponent = (
    <button
      className={`p-2 ${textColor} transition-colors duration-300 hover:bg-gray-200/30 rounded-full`}
      aria-label="Go back"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );

  const defaultRightComponent = (
    <div className="flex space-x-2">
      <button
        className={`p-2 ${textColor} transition-colors duration-300 hover:bg-gray-200/30 rounded-full`}
        aria-label="Share"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>
      <button
        className={`p-2 ${textColor} transition-colors duration-300 hover:bg-gray-200/30 rounded-full`}
        aria-label="Like"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-between transition-all duration-200"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${navOpacity})`,
        boxShadow:
          navOpacity > shadowThreshold
            ? "0 2px 4px rgba(0, 0, 0, 0.1)"
            : "none",
      }}
    >
      {/* 왼쪽 영역 */}
      {leftComponent || defaultLeftComponent}

      {/* 타이틀 - 스크롤 후에만 표시 */}
      <h1
        className={`font-bold truncate text-lg transform transition-all duration-300 ${textColor}`}
        style={{
          opacity: showTitle ? 1 : 0,
          transform: showTitle ? "translateY(0)" : "translateY(-10px)",
        }}
      >
        {title}
      </h1>

      {/* 오른쪽 영역 */}
      {rightComponent || defaultRightComponent}
    </div>
  );
};

export default TransformingNavbar;
