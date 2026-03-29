"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/shared/ui/shadcn/skeleton";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";

import { User } from "@/entities/user";

import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";

import { useTabState } from "./model/useTabState";
import { TabNavigation } from "./ui/TabNavigation";
import { EmptyState } from "./ui/EmptyState";

const MyRecipesTabContent = dynamic(
  () => import("@/widgets/MyRecipesTabContent"),
  {
    loading: () => (
      <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        <RecipeGridSkeleton count={8} isSimple />
      </div>
    ),
  }
);

const MyFavoriteRecipesTabContent = dynamic(
  () =>
    import("@/features/view-favorite-recipes").then((mod) => ({
      default: mod.MyFavoriteRecipesTabContent,
    })),
  {
    loading: () => (
      <div className="grid gap-4 p-4 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        <RecipeGridSkeleton count={8} isSimple={false} />
      </div>
    ),
  }
);

const CalendarTabContent = dynamic(
  () => import("@/widgets/CalendarTabContent"),
  {
    loading: () => (
      <div className="p-4">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    ),
  }
);

type UserTabProps = {
  user: User | undefined;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
};

const UserTab = ({ user, isOwnProfile, isLoggedIn }: UserTabProps) => {
  const { tabs, activeTab, activeTabIndex, setActiveTab } = useTabState({
    isOwnProfile,
    hasFirstRecord: user?.hasFirstRecord ?? false,
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "recipes":
        return (
          user && (
            <MyRecipesTabContent userId={user.id} isOwnProfile={isOwnProfile} />
          )
        );
      case "saved":
        return <MyFavoriteRecipesTabContent />;
      case "calendar":
        return (
          <ErrorBoundary
            key="calendar-tab"
            fallback={<SectionErrorFallback message="캘린더를 불러올 수 없어요" />}
          >
            <CalendarTabContent />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  const needsLogin = !isLoggedIn && user?.id === "0";

  return (
    <>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        activeTabIndex={activeTabIndex}
        onTabChange={setActiveTab}
      />

      {needsLogin ? <EmptyState /> : renderTabContent()}
    </>
  );
};

export default UserTab;
