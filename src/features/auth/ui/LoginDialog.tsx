"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";

import LoginContent from "@/app/login/components/LoginContent";

type LoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile && open) {
      router.push("/login");
      onOpenChange(false);
    }
  }, [isMobile, open, router, onOpenChange]);

  if (isMobile) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full max-w-3xl max-h-[700px] p-0 overflow-hidden [&>button]:z-50">
        <DialogTitle className="sr-only">로그인</DialogTitle>
        <LoginContent />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
