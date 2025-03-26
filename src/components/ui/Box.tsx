import { cn } from "@/lib/utils";

type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

const Box = ({ children, className }: BoxProps) => {
  return (
    <div className={cn("border border-gray-200 p-4", className)}>
      {children}
    </div>
  );
};

export default Box;
