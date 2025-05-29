import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

// 페이지 전환 시 적용할 애니메이션 variant입니다.
// 필요에 따라 다양한 효과로 커스터마이징 할 수 있습니다.
const pageVariants = {
  initial: {
    opacity: 0.7,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

// 애니메이션 지속 시간, 이징 등을 설정합니다.
const pageTransition = {
  type: 'tween',
  ease: 'easeIn', // 'anticipate' 대신 기본 이징으로 변경
  duration: 0.25, // 지속 시간 짧게 조정하여 테스트
};

const AnimatedOutlet = () => {
  const location = useLocation();
  const motionRef = useRef<HTMLDivElement>(null);
  return (
    <AnimatePresence mode="wait" initial={false}>
      {/*
          motion.div는 애니메이션을 적용할 실제 DOM 요소입니다.
          key prop은 AnimatePresence가 어떤 자식이 변경되었는지 감지하는 데 매우 중요합니다.
          location.pathname을 사용하면 경로가 변경될 때마다 새로운 컴포넌트로 인식됩니다.
        */}
      <motion.div
        ref={motionRef}
        key={location.pathname}
        initial="initial" // 초기 상태 (pageVariants.initial)
        animate="in" // 마운트 시 애니메이션 상태 (pageVariants.in)
        variants={pageVariants} // 위에서 정의한 variants 객체
        transition={pageTransition} // 위에서 정의한 transition 객체
        style={{
          position: 'absolute', // 부드러운 전환을 위해 페이지들이 겹칠 수 있도록 absolute 포지셔닝
          width: '100%',
          height: '100%',
          backgroundColor: '#fff', // 필요에 따라 설정
        }}
        className="min-h-screen overflow-y-auto pb-20" // 기존 className이 있다면 여기에 적용
      >
        {/* <div className="page-wrapper">  // 또는 Outlet을 한 번 더 감쌀 수 있습니다. */}
        <Outlet context={{ motionRef }} />
        {/* </div> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
