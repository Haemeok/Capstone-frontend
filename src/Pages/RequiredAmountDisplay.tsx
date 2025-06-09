import useScrollAnimate from '@/hooks/useScrollAnimate';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/recipe';

type RequiredAmountDisplayProps = {
  prefix: string;
  suffix: string;
  pointText: string;
  containerClassName?: string;
  textClassName?: string;
  icon?: React.ReactNode;
};

const PointDisplayBanner = ({
  pointText,
  prefix,
  suffix,
  containerClassName,
  textClassName,
  icon,
}: RequiredAmountDisplayProps) => {
  const { targetRef } = useScrollAnimate<HTMLDivElement>();
  return (
    <div
      ref={targetRef}
      className={cn(
        'mb-2 flex gap-2 rounded-lg border-1 border-gray-300 p-3 px-2 text-sm',
        containerClassName,
      )}
      style={{ opacity: 0 }}
    >
      <div className="flex w-fit items-center">
        <p>{prefix}</p>
        <p className={cn('text-olive-mint mr-1 ml-1', textClassName)}>
          {pointText}
        </p>
        <p>{suffix}</p>
        {icon}
      </div>
    </div>
  );
};

export default PointDisplayBanner;
