"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { ChefHat, Home, Refrigerator, Search, Sparkles } from "lucide-react";

import { shouldHideNavbar } from "@/shared/lib/navigation";
import { useInputFocusStore } from "@/shared/store/useInputFocusStore";
import { UnsavedChangesModal } from "@/shared/ui/modal/UnsavedChangesModal";

import { useUserStore } from "@/entities/user";

import AIRecipeNotificationBadge from "@/widgets/AIRecipeNotificationBadge";

import BottomNavButton from "./BottomNavButton";

const isRecipeEditPage = (pathname: string) => {
  return (
    pathname === "/recipes/new" ||
    (pathname.startsWith("/recipes/") && pathname.includes("/edit"))
  );
};

const BottomNavBar = () => {
  const { user } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const { isInputFocused } = useInputFocusStore();

  if (shouldHideNavbar(pathname)) {
    return null;
  }

  if (isInputFocused) {
    return null;
  }

  const handleNavClick = (path: string) => (e: React.MouseEvent) => {
    if (isRecipeEditPage(pathname)) {
      e.preventDefault();
      setPendingPath(path);
      setIsModalOpen(true);
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingPath) {
      router.push(pendingPath);
      setPendingPath(null);
    }
  };

  return (
    <>
      <footer className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white px-6 pt-3 pb-5 opacity-97 supports-[height:100dvh]:pb-[max(env(safe-area-inset-bottom),1.25rem)]">
        <BottomNavButton
          path="/"
          icon={<Home size={24} className="mb-1" />}
          label="홈"
          onClick={handleNavClick("/")}
        />
        <BottomNavButton
          path="/search"
          icon={<Search size={24} className="mb-1" />}
          label="검색"
          onClick={handleNavClick("/search")}
        />
        <BottomNavButton
          path="/ingredients"
          icon={<Refrigerator size={24} className="mb-1" />}
          label="냉장고"
          onClick={handleNavClick("/ingredients")}
        />

        <AIRecipeNotificationBadge>
          <BottomNavButton
            path="/recipes/new/ai"
            icon={<Sparkles size={24} className="mb-1" />}
            label="AI 레시피"
            onClick={handleNavClick("/recipes/new/ai")}
          />
        </AIRecipeNotificationBadge>

        <BottomNavButton
          path={`/users/${user?.id ?? "guestUser"}`}
          icon={<ChefHat size={24} className="mb-1" />}
          label="My"
          onClick={handleNavClick(`/users/${user?.id ?? "guestUser"}`)}
        />
      </footer>

      <UnsavedChangesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirmNavigation}
      />
    </>
  );
};

export default BottomNavBar;
