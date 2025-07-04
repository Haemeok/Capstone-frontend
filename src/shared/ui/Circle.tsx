import { LoaderCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type CircleProps = {
  className?: string;
  props?: React.ComponentProps<typeof LoaderCircleIcon>;
  size?: number;
};

const Circle = ({ className, size, ...props }: CircleProps) => (
  <LoaderCircleIcon
    className={cn('animate-spin', className)}
    {...props}
    size={size}
  />
);

export default Circle;
