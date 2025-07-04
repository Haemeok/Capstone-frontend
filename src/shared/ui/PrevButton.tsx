import { useRouter } from "next/router";

import { ArrowLeftIcon } from "lucide-react";

type PrevButtonProps = {
  className?: string;
  onClick?: () => void;
  size?: number;
};

const PrevButton = ({ className, onClick, size = 24 }: PrevButtonProps) => {
  const router = useRouter();

  const handleClick = onClick ?? (() => router.back());

  return (
    <button className={className} onClick={handleClick}>
      <ArrowLeftIcon size={size} />
    </button>
  );
};

export default PrevButton;
