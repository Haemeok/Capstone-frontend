import { cn } from "@/lib/utils";

type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

const Box = ({ children, className }: BoxProps) => {
  return (
    <div className={cn("border-y-1 border-[#f7f7f7] p-4", className)}>
      {children}
    </div>
  );
};

export default Box;
