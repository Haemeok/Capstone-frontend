import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';

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

const pageTransition = {
  type: 'tween',
  ease: 'easeIn',
  duration: 0.25,
};

const AnimatedOutlet = () => {
  const { pathname } = useLocation();
  const motionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scrollY = sessionStorage.getItem(`scroll_position_${pathname}`);

    if (motionRef.current) {
      if (scrollY) {
        setTimeout(() => {
          if (motionRef.current) {
            motionRef.current.scrollTo(0, parseInt(scrollY, 10));
          }
        }, 0);
      } else {
        motionRef.current.scrollTo(0, 0);
      }
    }

    return () => {
      if (motionRef.current && pathname === '/search') {
        sessionStorage.setItem(
          `scroll_position_${pathname}`,
          motionRef.current.scrollTop.toString(),
        );
      }
    };
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        ref={motionRef}
        key={pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
        }}
        className="min-h-screen overflow-y-auto pb-[70px]"
      >
        <Outlet context={{ motionRef }} />
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
