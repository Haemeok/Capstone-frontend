"use client";

import { Image } from "@/shared/ui/image/Image";
import { useRouter } from "next/navigation";

import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { X } from "lucide-react";

type AICreditDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const AICreditDrawer = ({ isOpen, onOpenChange }: AICreditDrawerProps) => {
  const router = useRouter();
  const { Container, Content, Title } = useResponsiveSheet();

  const handleCTAClick = () => {
    onOpenChange(false);
    router.push("/recipes/new/ai");
  };

  return (
    <Container open={isOpen} onOpenChange={onOpenChange}>
      <Content className="border-0 bg-white shadow-xl sm:max-w-md">
        <Title className="sr-only">AI 무료 이용권</Title>

        <div className="flex flex-col items-center px-6">
          <div className="mt-4 flex justify-center">
            <Image
              src="/gift.png"
              alt="AI 무료 이용권"
              wrapperClassName="relative h-60 w-60"
              priority
            />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              AI 무료 이용권을 드렸어요!
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              하루 1개씩 AI 무료 이용권을 제공해요
              <br />
              AI와 함께 나만의 레시피를 만들어보세요
            </p>
          </div>

          <button
            onClick={handleCTAClick}
            className="bg-olive-light mt-8 h-14 w-full cursor-pointer rounded-2xl text-base font-semibold text-white"
          >
            AI 레시피 만들기
          </button>

          <div className="mx-auto mt-6 h-1 w-32 rounded-full bg-gray-300 sm:hidden" />
        </div>
      </Content>
    </Container>
  );
};

export default AICreditDrawer;
