import { cn } from "@/shared/lib/utils";
import { UserRound } from "lucide-react";

type UserRecipeBadgeProps = {
  className?: string;
};

const UserRecipeBadge = ({ className }: UserRecipeBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex h-5 items-center justify-center rounded-full bg-blue-500 px-2.5",
        className
      )}
      aria-label="사용자 레시피"
    >
      <UserRound className="h-3.5 w-3.5 text-white" />
    </div>
  );
};

export default UserRecipeBadge;
