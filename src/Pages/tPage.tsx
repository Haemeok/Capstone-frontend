import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

const TopNavBar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // 뷰포트 높이의 비율로 임계값 설정
  const startThresholdRatio = 0.05; // 뷰포트 높이의 5%
  const endThresholdRatio = 0.2; // 뷰포트 높이의 20%

  // 스크롤 위치와 뷰포트 크기를 추적하는 이벤트 리스너
  useEffect(() => {
    // 초기 뷰포트 높이 설정
    setViewportHeight(window.innerHeight);

    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 스크롤 위치에 따른 불투명도 계산 (0부터 1까지)
  const calculateOpacity = () => {
    const startThreshold = viewportHeight * startThresholdRatio;
    const endThreshold = viewportHeight * endThresholdRatio;

    if (scrollPosition <= startThreshold) return 0;
    if (scrollPosition >= endThreshold) return 1;

    // startThreshold와 endThreshold 사이에서 선형적으로 증가
    return (scrollPosition - startThreshold) / (endThreshold - startThreshold);
  };

  const opacity = calculateOpacity();
  const showFullNav = opacity > 0.1; // 특정 불투명도 이상일 때 전체 네비게이션 표시

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center px-4 h-16 transition-all duration-200`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        boxShadow:
          opacity > 0.3 ? `0 2px 4px rgba(0, 0, 0, ${opacity * 0.1})` : "none",
      }}
    >
      <button className="p-2 rounded-full hover:bg-gray-100">
        <ChevronLeft size={24} />
      </button>

      {/* 전체 네비게이션 메뉴 - 불투명도에 맞춰 표시 */}
      <div
        className="flex items-center justify-between w-full ml-4 transition-opacity duration-200"
        style={{
          opacity: opacity * 1.5 > 1 ? 1 : opacity * 1.5, // 메뉴 불투명도를 약간 더 빨리 증가
          visibility: showFullNav ? "visible" : "hidden",
        }}
      >
        <div className="font-medium">페이지 제목</div>

        <div className="flex gap-4">
          <button className="px-3 py-1 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            메뉴1
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            메뉴2
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            메뉴3
          </button>
        </div>
      </div>
    </nav>
  );
};

// 스크롤 테스트를 위한 전체 페이지 컴포넌트
const Page = () => {
  return (
    <div>
      <TopNavBar />

      {/* 컨텐츠 영역 (스크롤 테스트용) */}
      <div className="pt-16 px-4">
        <h1 className="text-2xl font-bold mb-4">페이지 제목</h1>
        <p className="mb-4">
          아래로 스크롤하면 네비게이션 바가 점진적으로 변합니다. 스크롤 위치에
          따라 불투명도가 서서히 증가합니다.
        </p>

        {/* 스크롤 테스트를 위한 더미 컨텐츠 */}
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="my-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold">섹션 {index + 1}</h2>
            <p>
              이 영역은 스크롤 테스트를 위한 더미 컨텐츠입니다. 스크롤을
              내리면서 상단 네비게이션 바의 변화를 관찰해보세요.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
