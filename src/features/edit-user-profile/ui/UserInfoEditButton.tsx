import { useRouter } from "next/navigation";

import { Edit } from "lucide-react";

import { cn } from "@/lib/utils";

type UserInfoEditButtonProps = {
  className?: string;
};

const UserInfoEditButton = ({ className = "" }: UserInfoEditButtonProps) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/user/info")}
      className={cn(
        "bg-olive-light absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-md",
        className
      )}
    >
      <Edit size={14} className="text-white" />
    </div>
  );
};

export default UserInfoEditButton;
