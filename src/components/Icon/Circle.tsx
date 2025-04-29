import { cn } from '@/lib/utils';
import { LoaderCircleIcon } from 'lucide-react';

type CircleProps = {
  className?: string;
  props?: React.ComponentProps<typeof LoaderCircleIcon>;
};

const Circle = ({ className, ...props }: CircleProps) => (
  <LoaderCircleIcon className={cn('animate-spin', className)} {...props} />
);

export default Circle;
