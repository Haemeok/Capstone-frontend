"use client";

import { X } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import { useCookingRecordLaunch } from "../model/useCookingRecordLaunch";
import styles from "./CookingRecordLaunchDrawer.module.css";

export const CookingRecordLaunchDrawer = () => {
  const { isOpen, dismiss } = useCookingRecordLaunch();

  if (!isOpen) return null;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dismiss();
      }}
    >
      <DrawerContent
        hasDescription
        className="mx-auto h-[374px] max-w-[480px] overflow-hidden rounded-t-[22px] border-0 bg-[#eef3e9] motion-reduce:animate-none [&>div:first-child]:hidden"
      >
        <img
          src="/events/cooking-record/food-cluster.webp"
          alt=""
          width={640}
          height={960}
          className={`${styles.foodCluster} pointer-events-none absolute -top-20 -right-14 h-[495px] w-[330px] object-contain`}
        />

        <DrawerClose asChild>
          <button
            type="button"
            aria-label="요리기록 출시 안내 닫기"
            className="absolute top-3.5 right-3.5 z-20 grid size-11 place-items-center rounded-full border border-black/10 bg-white/95 shadow-sm"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </DrawerClose>

        <div className="relative z-10 w-[200px] px-6 pt-8">
          <span className={`${styles.label} text-ink-sub text-xs`}>
            NEW · 요리기록
          </span>
          <DrawerTitle className="text-ink mt-2 text-[25px] leading-[1.2] tracking-[-0.045em]">
            오늘 먹은 음식,
            <br />
            사진으로 남겨요
          </DrawerTitle>
          <DrawerDescription className="text-ink-sub mt-3 w-[174px] text-sm leading-[1.5] font-medium">
            한 줄 메모를 더하면 나만의 요리 달력이 완성돼요.
          </DrawerDescription>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pt-3 pb-[max(28px,env(safe-area-inset-bottom))]">
          <LocalizedLink
            href="/events/cooking-record"
            onClick={dismiss}
            className="bg-ink active:bg-ink-sub flex min-h-[52px] items-center justify-center rounded-2xl text-base font-bold text-white"
          >
            요리기록 시작하기
          </LocalizedLink>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
