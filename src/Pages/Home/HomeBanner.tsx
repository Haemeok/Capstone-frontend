import useScrollAnimate from '@/hooks/useScrollAnimate';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

type HomeBannerProps = {
  title: string;
  description: string;
  image: string;
  to: string;
};

const HomeBanner = ({ title, description, image, to }: HomeBannerProps) => {
  const { targetRef } = useScrollAnimate<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <div
      ref={targetRef}
      className="relative mt-2 flex w-full items-center gap-2 rounded-lg border-1 border-gray-300 p-2 text-sm"
      style={{ opacity: 0 }}
    >
      <img src={image} alt="Coffee" className="h-15 w-15" />
      <div className="flex flex-col">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <button onClick={() => navigate(to)}>
        <ChevronRight className="absolute top-1/2 right-2 translate-y-[-50%] text-slate-500" />
      </button>
    </div>
  );
};

export default HomeBanner;
