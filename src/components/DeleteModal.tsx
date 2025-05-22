// src/components/DeleteModal.tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type DeleteModalProps = {
  /** 모달 열림 상태 */
  open: boolean;
  /** open 상태를 관리하는 setter */
  onOpenChange: (open: boolean) => void;
  /** 헤더에 보여줄 문구 (e.g. "게시글을 삭제하시겠습니까?") */
  title: string;
  /** 모달 내용 (e.g. "삭제 시 복구할 수 없습니다.") */
  description: string;
  /** 사용자가 "삭제" 누를 때 호출할 비동기 함수 */
  onConfirm: () => Promise<void> | void;
  /** 취소 버튼 레이블 (기본: 취소) */
  cancelLabel?: string;
  /** 확인 버튼 레이블 (기본: 삭제) */
  confirmLabel?: string;
};

export const DeleteModal = ({
  open,
  onOpenChange,
  title,
  description = '삭제 시 복구할 수 없습니다.',
  onConfirm,
  cancelLabel = '취소',
  confirmLabel = '삭제',
}: DeleteModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm pb-0">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-0 space-x-2">
          <DialogClose asChild>
            <button className="my-2 rounded-md px-4 text-gray-800">
              {cancelLabel}
            </button>
          </DialogClose>
          <div className="h-[1px] w-full bg-gray-200"></div>
          <button
            className="my-2 rounded-md px-4 font-semibold text-red-600"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <div className="h-[1px] w-full bg-gray-200"></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
