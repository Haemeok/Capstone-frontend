import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useScrollAnimate from '@/hooks/useScrollAnimate';

gsap.registerPlugin(ScrollTrigger);

type RequiredAmountDisplayProps = {
  totalPrice: string;
};

const RequiredAmountDisplay = ({ totalPrice }: RequiredAmountDisplayProps) => {
  const { targetRef } = useScrollAnimate<HTMLDivElement>();

  return (
    <div
      ref={targetRef}
      className="mb-2 flex items-center rounded-lg border-1 border-gray-300 p-3 px-2 text-sm"
      style={{ opacity: 0 }}
    >
      <p>이 레시피에 약</p>
      <p className="text-olive-mint ml-1">{totalPrice}원</p>
      <p>이 필요해요!</p>
    </div>
  );
};

export default RequiredAmountDisplay;
