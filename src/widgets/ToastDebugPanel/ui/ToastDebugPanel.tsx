"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/shadcn/drawer";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

import { useToastStore } from "@/widgets/Toast/model/store";
import type { ToastType } from "@/widgets/Toast/model/types";

type Variant = ToastType["variant"];
type Position = NonNullable<ToastType["position"]>;

const VARIANT_LIST: Variant[] = [
  "success",
  "error",
  "warning",
  "info",
  "default",
  "rich-youtube",
  "action",
];

const POSITION_LIST: Position[] = ["top", "middle", "bottom"];

const SAMPLE_MESSAGE: Record<Variant, string> = {
  success: "성공 토스트 예시 메시지입니다.",
  error: "에러가 발생했어요.",
  warning: "주의가 필요해요.",
  info: "참고할 정보입니다.",
  default: "기본 토스트입니다.",
  "rich-youtube": "유튜브 레시피 추출 진행중",
  action: `"저장된 레시피"에 보관되었습니다.`,
};

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ToastDebugPanel = ({ open, onOpenChange }: Props) => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const addToast = useToastStore((s) => s.addToast);

  const fireToast = (variant: Variant, position: Position) => {
    if (variant === "rich-youtube") {
      addToast({
        message: SAMPLE_MESSAGE[variant],
        variant,
        position,
        richContent: {
          thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
          title: "샘플 레시피 제목",
          subtitle: "추출 진행중...",
        },
      });
      return;
    }
    if (variant === "action") {
      addToast({
        message: SAMPLE_MESSAGE[variant],
        variant,
        position,
        action: {
          label: "변경",
          onClick: () =>
            addToast({
              message: "변경 액션이 호출됨",
              variant: "info",
              position,
            }),
        },
      });
      return;
    }
    addToast({
      message: SAMPLE_MESSAGE[variant],
      variant,
      position,
    });
  };

  const Body = (
    <div className="space-y-6 px-4 pb-6">
      {POSITION_LIST.map((position) => (
        <section key={position}>
          <h3 className="mb-2 text-sm font-bold text-gray-700">
            position: {position}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {VARIANT_LIST.map((variant) => (
              <button
                key={`${position}-${variant}`}
                type="button"
                onClick={() => fireToast(variant, position)}
                className="rounded-xl border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {variant}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-hidden border-0 bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold text-gray-900">
              🐛 Toast Debug
            </DialogTitle>
          </DialogHeader>
          {Body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-3xl">
        <DrawerHeader className="px-6 pt-6 pb-2 text-left">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            🐛 Toast Debug
          </DrawerTitle>
        </DrawerHeader>
        {Body}
      </DrawerContent>
    </Drawer>
  );
};
