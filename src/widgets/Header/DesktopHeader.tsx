"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Search, User } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/shadcn/button";
import { Image } from "@/shared/ui/image/Image";

import { useUserStore } from "@/entities/user";

import NotificationButton from "./NotificationButton";

const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/search", label: "레시피 검색" },
  { href: "/ingredients", label: "냉장고" },
  { href: "/recipes/new/ai", label: "AI 레시피" },
] as const;

const DesktopHeader = () => {
  const pathname = usePathname();
  const { user } = useUserStore();

  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 z-header bg-white border-b border-gray-200 sticky-optimized">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.svg"
            alt="Recipio Logo"
            wrapperClassName="h-8 w-8"
            skeletonClassName="h-8 w-8 rounded-full"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold text-gray-900">Recipi'O</span>
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                " font-medium transition-colors hover:text-gray-900",
                pathname === link.href
                  ? "text-gray-900 font-semibold"
                  : "text-gray-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="검색"
          >
            <Search size={24} className="text-gray-600" />
          </button>

          <NotificationButton />

          {user ? (
            <Link
              href={`/users/${user.id}`}
              className="text-gray-600 font-sm hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <div className="flex flex-col items-center">
                <User size={24} className="text-gray-600" />
                <p className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
                  My
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="border-1 border-gray-200  px-4 py-2 rounded-xl transition-colors hover:text-gray-900">
                  로그인
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default DesktopHeader;
