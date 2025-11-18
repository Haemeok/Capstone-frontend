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
    <header className="z-header sticky-optimized fixed top-0 right-0 left-0 hidden border-b border-gray-200 bg-white md:block">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image src="/app-logo-512.png" alt="Recipio Logo" width={32} />
          <span className="text-xl font-bold text-gray-900">RECIPI'O</span>
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium transition-colors hover:text-gray-900",
                pathname === link.href
                  ? "font-semibold text-gray-900"
                  : "text-gray-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            aria-label="검색"
          >
            <Search size={24} className="text-gray-600" />
          </button>

          <NotificationButton />

          {user ? (
            <Link
              href={`/users/${user.id}`}
              className="font-sm rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <div className="flex flex-col items-center">
                <User size={24} className="text-gray-600" />
                <p className="text-xs text-gray-600 transition-colors hover:text-gray-900">
                  My
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="cursor-pointer rounded-xl border-1 border-gray-200 px-4 py-2 transition-colors hover:text-gray-900">
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
