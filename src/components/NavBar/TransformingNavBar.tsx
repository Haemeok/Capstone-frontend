import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PrevButton from '../Button/PrevButton'; // 경로는 실제 프로젝트에 맞게 조정

type TransformingNavbarProps = {
  title: string;
  targetRef: React.RefObject<HTMLElement | null>; // 스크롤을 감지할 대상 요소 (예: 페이지 상단 이미지)
  leftComponent?: React.ReactNode; // 이전 버튼 등이 올 수 있음
  rightComponent?: React.ReactNode; // 공유, 저장 버튼 등이 올 수 있음
  // 기존 threshold 값들은 애니메이션의 시작/종료 지점을 결정하는 데 참고용으로 사용
  titleThreshold?: number; // (기본값 0.7) 제목이 완전히 나타나는 시점
  textColorThreshold?: number; // (기본값 0.5) 텍스트 색상이 변경되는 시점
  shadowThreshold?: number; // (기본값 0.8) 그림자가 나타나는 시점
};

const TransformingNavbar = ({
  title,
  targetRef,
  leftComponent = <PrevButton />, // 기본 왼쪽 컴포넌트 (필요에 따라 수정)
  rightComponent,
  titleThreshold = 0.7,
  textColorThreshold = 0.5,
  shadowThreshold = 0.8,
}: TransformingNavbarProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null); // 제목(h1) 요소에 대한 ref

  useEffect(() => {
    if (!targetRef.current || !headerRef.current || !titleRef.current) {
      return;
    }

    const headerElement = headerRef.current;
    const titleElement = titleRef.current;

    // targetRef 요소의 높이를 기준으로 end 지점을 설정하거나, 고정 값 사용 가능
    const endTrigger = targetRef.current.offsetHeight * 0.8; // 예: target 높이의 80% 지점까지 애니메이션

    // GSAP 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: targetRef.current, // targetRef 요소가 스크롤될 때 애니메이션 발동
        start: 'top top', // targetRef의 상단이 뷰포트 상단에 닿을 때 시작
        end: `+=${endTrigger}`, // start 지점부터 targetRef 높이의 80%만큼 스크롤될 때까지
        scrub: true, // 0.5초의 부드러운 스크러빙 효과
        // markers: true,           // 개발 중 위치 확인용 마커 (배포 시 제거)
      },
    });

    // 1. 네비게이션 바 배경색 투명도 애니메이션 (투명 -> 흰색)
    tl.fromTo(
      headerElement,
      { backgroundColor: 'rgba(255, 255, 255, 0)' }, // 시작: 투명
      { backgroundColor: 'rgba(255, 255, 255, 1)' }, // 끝: 불투명 흰색
      0, // 타임라인 시작 지점 (0초)
    );

    // 2. 네비게이션 바 그림자 애니메이션
    // shadowThreshold (예: 0.8) -> 전체 애니메이션 구간의 80% 지점에서 그림자 나타나기 시작
    const shadowStartTime = `${shadowThreshold * 100}%`; // "80%"
    tl.fromTo(
      headerElement,
      { boxShadow: 'none' },
      { boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
      shadowStartTime, // 타임라인의 특정 진행률 시점에서 시작
    );

    // 3. 제목(title) 나타나는 애니메이션
    // titleThreshold (예: 0.7) -> 전체 애니메이션 구간의 70% 지점에서 제목 나타나기 시작
    const titleStartTime = `${titleThreshold * 100}%`; // "70%"
    tl.fromTo(
      titleElement,
      { opacity: 0, y: -10 }, // 시작: 투명하고 약간 위로
      { opacity: 1, y: 0 }, // 끝: 불투명하고 원래 위치로
      titleStartTime,
    );

    // 4. 네비게이션 바 내부 아이콘 및 텍스트 색상 변경 (흰색 -> 검은색)
    // textColorThreshold (예: 0.5) -> 전체 애니메이션 구간의 50% 지점에서 색상 변경 시작/완료
    // headerElement 자체의 color 속성을 변경하여 자식 요소들이 상속받도록 함
    // leftComponent(PrevButton)와 rightComponent 내부의 텍스트/아이콘도 이를 따르도록 가정
    // 또는 각 컴포넌트에 직접 ref를 전달하여 제어할 수도 있지만, color 상속이 더 간단.
    const textColorChangeTime = `${textColorThreshold * 100}%`; // "50%"
    tl.fromTo(
      headerElement,
      { color: 'white' }, // 시작: 흰색 텍스트/아이콘
      { color: 'black' }, // 끝: 검은색 텍스트/아이콘
      textColorChangeTime,
    );
    // 만약 rightComponent 내부 요소가 color를 상속받지 않는다면,
    // rightComponent에 ref를 전달하고 해당 ref의 color도 함께 애니메이션하거나,
    // rightComponent가 props로 색상 값을 받아 내부적으로 처리하도록 수정 필요.
    // 여기서는 headerElement의 color를 변경하는 것으로 가정.

    // 컴포넌트 언마운트 시 타임라인과 ScrollTrigger 정리
    return () => {
      tl.kill(); // 타임라인과 여기에 연결된 모든 ScrollTrigger 인스턴스를 제거
    };
  }, [targetRef, titleThreshold, textColorThreshold, shadowThreshold]); // 의존성 배열

  return (
    <div
      ref={headerRef}
      // 초기 스타일은 GSAP fromTo의 from 값과 일치하거나 CSS로 설정
      className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between px-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0)', // 초기 배경 투명
        color: 'white', // 초기 텍스트/아이콘 색상
        boxShadow: 'none', // 초기 그림자 없음
      }}
    >
      <div className="flex max-w-full min-w-0 items-center gap-2">
        {/* leftComponent (예: PrevButton)는 부모(headerRef)의 color를 상속받음 */}
        {React.cloneElement(leftComponent as React.ReactElement, {
          // PrevButton이 className을 받을 수 있도록 가정
          // 또는 PrevButton 내부에서 부모의 color를 사용하도록 스타일링
          // 여기서는 부모의 color를 상속한다고 가정하고 추가 스타일링 없음
        })}

        <h1
          ref={titleRef}
          className="truncate text-lg font-bold" // Tailwind의 text-color 클래스 제거
          style={{ opacity: 0, transform: 'translateY(-10px)' }} // 초기 스타일
        >
          {title}
        </h1>
      </div>
      {/* rightComponent도 부모(headerRef)의 color를 상속받거나,
          별도의 로직으로 색상이 제어되어야 함.
          간단하게는 rightComponent도 color를 상속한다고 가정.
      */}
      {rightComponent}
    </div>
  );
};

export default TransformingNavbar;
