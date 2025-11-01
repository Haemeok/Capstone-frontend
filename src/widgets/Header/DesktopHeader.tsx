"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Search } from "lucide-react";

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
    <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/recipio_logo.svg"
            alt="Recipeo Logo"
            wrapperClassName="h-8 w-8"
            skeletonClassName="h-8 w-8 rounded-full"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold text-gray-900">Recipeo</span>
        </Link>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gray-900",
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
            <Search size={20} className="text-gray-600" />
          </button>

          <NotificationButton />

          {user ? (
            <Link href={`/users/${user.id}`}>
              <Button variant="ghost" size="sm">
                마이페이지
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default DesktopHeader;
