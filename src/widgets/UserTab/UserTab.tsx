"use client";

import dynamic from "next/dynamic";

import { useUserPagesDict } from "@/shared/i18n";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import SectionErrorFallback from "@/shared/ui/SectionErrorFallback";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

import { User } from "@/entities/user";

import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";

import { useTabState } from "./model/useTabState";
import { EmptyState } from "./ui/EmptyState";
import { TabNavigation } from "./ui/TabNavigation";
import { TabPanels } from "./ui/TabPanels";

const MyRecipesTabContent = dynamic(
  () => import("@/widgets/MyRecipesTabContent"),
  {
    loading: () => (
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4 p-4 sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        <RecipeGridSkeleton count={8} isSimple />
      </div>
    ),
  }
);

const MySavedRecipesTabContent = dynamic(
  () =>
    import("@/features/view-saved-recipes").then((mod) => ({
      default: mod.MySavedRecipesTabContent,
    })),
  {
    loading: () => (
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4 p-4 sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
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
  const t = useUserPagesDict();
  const { tabs, activeTab, activeTabIndex, setActiveTab } = useTabState({
    isOwnProfile,
    hasFirstRecord: user?.hasFirstRecord ?? false,
  });

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case "recipes":
        return (
          user && (
            <MyRecipesTabContent userId={user.id} isOwnProfile={isOwnProfile} />
          )
        );
      case "saved":
        return <MySavedRecipesTabContent />;
      case "calendar":
        return (
          <ErrorBoundary
            key="calendar-tab"
            fallback={
              <SectionErrorFallback message={t.profile.calendarLoadError} />
            }
          >
            <CalendarTabContent />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  const panels = tabs.map((tab) => ({
    id: tab.id,
    content: renderTabContent(tab.id),
  }));

  const handleActiveIndexChange = (index: number) => {
    const tab = tabs[index];
    if (tab) setActiveTab(tab.id);
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

      {needsLogin ? (
        <EmptyState />
      ) : (
        <TabPanels
          panels={panels}
          activeIndex={activeTabIndex}
          onActiveIndexChange={handleActiveIndexChange}
        />
      )}
    </>
  );
};

export default UserTab;
