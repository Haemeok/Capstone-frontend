import useScrollAnimate from '@/hooks/useScrollAnimate';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/recipe';

type RequiredAmountDisplayProps = {
  price: number;
  prefix: string;
  suffix: string;
  containerClassName?: string;
  priceClassName?: string;
};

const RequiredAmountDisplay = ({
  price,
  prefix,
  suffix,
  containerClassName,
  priceClassName,
}: RequiredAmountDisplayProps) => {
  const { targetRef } = useScrollAnimate<HTMLDivElement>();
  const formattedPrice = formatPrice(price);
  return (
    <div
      ref={targetRef}
      className={cn(
        'mb-2 flex flex-col gap-2 rounded-lg border-1 border-gray-300 p-3 px-2 text-sm',
        containerClassName,
      )}
      style={{ opacity: 0 }}
    >
      <div className="flex w-fit items-center">
        <p>{prefix}</p>
        <p className={cn('text-olive-mint mr-1 ml-1', priceClassName)}>
          {formattedPrice}원
        </p>
        <p>{suffix}</p>
      </div>
    </div>
  );
};

export default RequiredAmountDisplay;
