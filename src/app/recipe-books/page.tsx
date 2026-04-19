"use client";

import { useRouter } from "next/navigation";

import { UserRound } from "lucide-react";

import {
  generateUserGradient,
  isDefaultProfileImage,
} from "@/shared/lib/colors";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Container } from "@/shared/ui/Container";
import { Image } from "@/shared/ui/image/Image";
import PrevButton from "@/shared/ui/PrevButton";

import { useUserStore } from "@/entities/user";

import { RecipeBookGrid } from "@/widgets/RecipeBookGrid";

export default function RecipeBooksPage() {
  const router = useRouter();
  const { user } = useUserStore();

  const handleBack = () => {
    triggerHaptic("Light");
    router.back();
  };

  return (
    <Container padding={false}>
      {/* sticky header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-gray-100 bg-white px-2">
        <PrevButton onClick={handleBack} size={24} className="shrink-0" />
        <h1 className="text-base font-bold text-gray-900">레시피북</h1>
      </header>

      {/* 프로필 row */}
      {user && (
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className="h-10 w-10 overflow-hidden rounded-full"
            style={
              user.profileImage && isDefaultProfileImage(user.profileImage)
                ? generateUserGradient(user.id)
                : undefined
            }
          >
            {user.profileImage ? (
              <Image src={user.profileImage} alt={user.nickname} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <UserRound className="h-6 w-6 text-gray-300" />
              </div>
            )}
          </div>
          <span className="text-base font-semibold text-gray-900">
            {user.nickname}
          </span>
        </div>
      )}

      {/* divider */}
      <div className="border-b border-gray-100" />

      {/* 폴더 그리드 */}
      <RecipeBookGrid />
    </Container>
  );
}
