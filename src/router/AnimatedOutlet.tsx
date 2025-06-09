import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

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
  const location = useLocation();
  const motionRef = useRef<HTMLDivElement>(null);
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        ref={motionRef}
        key={location.pathname}
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
