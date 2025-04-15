import React, { useRef, useEffect, useState } from 'react';

const ScrollTransformNavbar: React.FC = () => {
  const [navOpacity, setNavOpacity] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    // 임계값 배열 - 더 부드러운 전환을 위해 여러 지점 설정
    const thresholds = Array.from({ length: 20 }, (_, i) => i / 20);

    // 이미지 영역 감시 옵저버
    const imageObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // 이미지의 가시성 비율에 따른 opacity 계산
        // 이미지가 위로 사라질수록 navOpacity 증가
        const visibleRatio =
          1 - Math.max(0, Math.min(1, entry.intersectionRatio * 1.5));
        setNavOpacity(visibleRatio);

        // 특정 임계값에서 제목 표시 토글
        setShowTitle(visibleRatio > 0.7);

        // 콘텐츠 영역에 CSS 변수 설정 (스크롤 위치에 따른 추가 애니메이션용)
        if (contentRef.current) {
          contentRef.current.style.setProperty(
            '--scroll-progress',
            visibleRatio.toString(),
          );
        }

        // 헤더 색상 트랜지션을 위한 CSS 변수 설정
        if (headerRef.current) {
          headerRef.current.style.setProperty(
            '--nav-opacity',
            visibleRatio.toString(),
          );
        }
      },
      {
        threshold: thresholds,
        rootMargin: '-10% 0px 0px 0px', // 상단에서 10% 아래부터 감지 시작
      },
    );

    // 이미지 영역 감시 시작
    imageObserver.observe(imageRef.current);

    // 클린업
    return () => {
      imageObserver.disconnect();
    };
  }, []);

  // 네비게이션 텍스트 컬러 계산
  const textColor = navOpacity > 0.5 ? 'text-black' : 'text-white';

  return (
    <div className="relative">
      {/* 이미지 영역 */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          ref={imageRef}
          className="h-full w-full object-cover"
          src="https://images.services.kitchenstories.io/R0FZEANHBTbTmQzRhOTm6hOPPLk=/1080x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R412-photo-final-1-4x3.jpg"
          alt="Korean marinated eggs"
          loading="eager" // 최상단 이미지는 즉시 로드
        />
        {/* 이미지 위에 그라데이션 오버레이 - 텍스트 가독성 향상 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
      </div>

      {/* 상단 네비게이션 바 */}
      <div
        ref={headerRef}
        className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between px-4 transition-all duration-200"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${navOpacity})`,
          boxShadow: navOpacity > 0.8 ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        {/* 뒤로가기 버튼 */}
        <button
          className={`p-2 ${textColor} rounded-full transition-colors duration-300 hover:bg-gray-200/30`}
          aria-label="Go back"
        >
          <svg
            className="h-6 w-6"
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

        {/* 타이틀 - 스크롤 후에만 표시 */}
        <h1
          className={`transform text-lg font-bold transition-all duration-300 ${textColor}`}
          style={{
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
          Korean marinated eggs
        </h1>

        {/* 우측 아이콘들 */}
      </div>

      {/* 콘텐츠 영역 */}
      <div ref={contentRef} className="relative z-10 bg-white p-4">
        {/* 헤더 섹션 - 제목이 스크롤에 따라 살짝 위로 이동하는 효과 */}
        <div
          className="animate-on-scroll transition-transform duration-700"
          style={{
            transform: `translateY(calc(-10px * var(--scroll-progress, 0))`,
          }}
        >
          <h1 className="mt-2 mb-4 text-3xl font-bold">
            Korean marinated eggs (Mayak eggs) with rice
          </h1>

          {/* 별점 및 평가 */}
          <div className="mb-4 flex items-center">
            <div className="flex text-orange-500">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span className="text-gray-300">★</span>
            </div>
            <span className="ml-2 text-gray-600">Based on 29 ratings</span>
          </div>
        </div>

        {/* 공유 및 좋아요 버튼 */}
        <div className="animate-on-scroll mb-6 flex space-x-4">
          <button className="flex w-1/2 items-center justify-center rounded-full border p-3 transition-colors duration-300 hover:bg-gray-100">
            <svg
              className="mr-2 h-5 w-5"
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
            <span>Share</span>
          </button>
          <button className="flex w-1/2 items-center justify-center rounded-full border p-3 transition-colors duration-300 hover:bg-gray-100">
            <svg
              className="mr-2 h-5 w-5"
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
            <span>5.63K</span>
          </button>
        </div>

        {/* 사용자 정보 */}
        <div className="animate-on-scroll mb-6 flex items-center">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-blue-200">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Eric Chou"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold">Eric Chou</h3>
            <p className="text-gray-600">Community member</p>
            <a
              href="https://erictriesit.com/"
              className="text-orange-500 transition-all duration-300 hover:underline"
            >
              erictriesit.com/
            </a>
          </div>
        </div>

        {/* 본문 내용 */}
        <div className="animate-on-scroll mb-4">
          <p className="mb-4 leading-relaxed">
            I've been seeing these Korean Mayak eggs all over TikTok a few
            months ago and finally tried them - highly recommended! For the best
            results, marinate the eggs overnight and serve them with hot rice.
            The eggs can be stored in the refrigerator for up to 3 days.
          </p>

          <a
            href="#"
            className="inline-flex items-center text-orange-500 transition-all duration-300 hover:underline"
          >
            Read more
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </div>

        <hr className="my-6" />

        {/* 리뷰 섹션 */}
        <div className="animate-on-scroll">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <a
              href="#"
              className="inline-flex items-center text-orange-500 transition-all duration-300 hover:underline"
            >
              Read
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
          <p className="mb-4 text-gray-600">38 comments - 15 images</p>
        </div>

        {/* 예시 리뷰 이미지들 - 그리드 애니메이션 */}
        <div className="animate-on-scroll mb-8 grid grid-cols-4 gap-2">
          <div className="aspect-square transform overflow-hidden rounded bg-gray-200 transition-transform hover:scale-105">
            <img
              src="https://source.unsplash.com/random/200x200/?egg,food,1"
              alt="Review"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square transform overflow-hidden rounded bg-gray-200 transition-transform hover:scale-105">
            <img
              src="https://source.unsplash.com/random/200x200/?egg,food,2"
              alt="Review"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square transform overflow-hidden rounded bg-gray-200 transition-transform hover:scale-105">
            <img
              src="https://source.unsplash.com/random/200x200/?egg,food,3"
              alt="Review"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative aspect-square transform overflow-hidden rounded bg-gray-200 transition-transform hover:scale-105">
            <img
              src="https://source.unsplash.com/random/200x200/?egg,food,4"
              alt="Review"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-xl font-bold text-white">
              +12
            </div>
          </div>
        </div>

        {/* 레시피 섹션 */}
        <div className="animate-on-scroll mt-8">
          <h2 className="mb-4 flex items-center text-2xl font-bold">
            <svg
              className="mr-2 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Recipe
          </h2>
          <div className="space-y-4 leading-relaxed">
            <p className="animate-on-scroll">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
              elit neque. Class aptent taciti sociosqu ad litora torquent per
              conubia nostra, per inceptos himenaeos. Vestibulum sollicitudin
              libero vitae est consectetur, a molestie tortor consectetur.
            </p>
            <p className="animate-on-scroll">
              Pellentesque vel felis pellentesque, commodo neque nec, faucibus
              turpis. Cras et eros id nisi molestie dapibus in a libero. Ut
              lacinia, ante ac ultrices scelerisque, dui sapien egestas sapien.
            </p>
            <p className="animate-on-scroll">
              Vestibulum consectetur eu nunc ut ultricies. Aenean imperdiet
              dignissim purus sit amet faucibus. Integer vehicula ipsum a
              porttitor cursus. Pellentesque interdum orci dui, sit amet
              lobortis lectus rutrum ut.
            </p>
            <p className="animate-on-scroll">
              Phasellus commodo purus in ex varius, in pharetra massa
              ullamcorper. Nam condimentum justo vel quam aliquam sollicitudin.
              In eget venenatis est. Etiam luctus enim id eros sagittis dapibus.
            </p>
            <p className="animate-on-scroll">
              Nullam tempus eu orci ut egestas. Aliquam placerat luctus magna.
              Quisque consequat sollicitudin ante quis sagittis. Sed eget tellus
              vel sapien dapibus varius. Cras sit amet mi quam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollTransformNavbar;
