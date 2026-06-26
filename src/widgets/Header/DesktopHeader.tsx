"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { User } from "lucide-react";

import { LocalizedLink, stripLocale, useChromeDict } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import LoginPromotionBadge from "@/entities/user/ui/LoginPromotionBadge";
import { Image } from "@/shared/ui/image/Image";

import { useUserStore } from "@/entities/user";

const LoginDialog = dynamic(() => import("@/features/auth/ui/LoginDialog"), {
  ssr: false,
});

import NotificationButton from "./NotificationButton";

const NAV_LINKS = [
  { href: "/", labelKey: "home" },
  { href: "/search", labelKey: "recipeSearch" },
  { href: "/ingredients", labelKey: "fridge" },
  { href: "/recipes/new/ai", labelKey: "aiRecipe" },
  { href: "/recipes/new/youtube", labelKey: "youtubeRecipe" },
] as const;

const DesktopHeader = () => {
  const pathname = usePathname();
  const { barePath } = stripLocale(pathname);
  const t = useChromeDict();
  const { user, isAuthReady } = useUserStore();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  return (
    <>
      <header className="z-dropdown sticky-optimized fixed top-0 right-0 left-0 hidden border-b border-gray-200 bg-white md:block">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <LocalizedLink
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/web-app-manifest-192x192.png"
              alt="Recipio Logo"
              wrapperClassName="rounded-card"
              width={32}
            />
            <span className="text-ink text-xl font-bold">Recipi&apos;O</span>
          </LocalizedLink>

          <div className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <LocalizedLink
                key={link.href}
                href={link.href}
                className={cn(
                  "hover:text-ink font-medium transition-colors",
                  barePath === link.href
                    ? "text-ink font-semibold"
                    : "text-ink-sub"
                )}
              >
                {t[link.labelKey]}
              </LocalizedLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <NotificationButton />

            {!isAuthReady ? (
              <div className="h-10 w-[72px] animate-pulse rounded-xl bg-gray-100" />
            ) : user ? (
              <LocalizedLink
                href={`/users/${user.id}`}
                className="font-sm text-ink-sub hover:text-ink rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <div className="flex flex-col items-center">
                  <User size={24} className="text-ink-sub" />
                  <p className="text-ink-sub hover:text-ink text-xs transition-colors">
                    {t.my}
                  </p>
                </div>
              </LocalizedLink>
            ) : (
              <LoginPromotionBadge variant="desktop">
                <button
                  onClick={() => setIsLoginDialogOpen(true)}
                  className="hover:text-ink cursor-pointer rounded-xl border-1 border-gray-200 px-4 py-2 transition-colors"
                >
                  {t.login}
                </button>
              </LoginPromotionBadge>
            )}
          </div>
        </nav>
      </header>

      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </>
  );
};

export default DesktopHeader;
