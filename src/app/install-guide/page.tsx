"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Smartphone,
  Download,
  Share,
  Menu,
} from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { Image } from "@/shared/ui/image/Image";
import PrevButton from "@/shared/ui/PrevButton";
import { GUIDE_BASE_URL } from "@/shared/config/constants/recipe";

type TabType = "ios" | "android";

const InstallGuidePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ios");

  return (
    <Container padding={false} className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <PrevButton className="text-gray-600" />
          <h1 className="text-lg font-bold text-gray-900">앱 설치 가이드</h1>
        </div>
      </div>

      <div className="mx-auto max-w-lg p-4 pb-20">
        <div className="mb-6 flex flex-col items-center justify-center gap-4 text-center">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="레시피오 앱 아이콘"
            wrapperClassName="h-20 w-20 rounded-2xl shadow-lg"
            width={80}
            height={80}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recipi'O 앱 설치하기
            </h2>
            <p className="text-gray-600">
              홈 화면에 추가하여 앱처럼 사용해보세요
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-1 shadow-sm">
          <div className="flex">
            <button
              onClick={() => setActiveTab("ios")}
              className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                activeTab === "ios"
                  ? "bg-olive-light text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Smartphone size={16} />
                Safari (iPhone)
              </span>
            </button>
            <button
              onClick={() => setActiveTab("android")}
              className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                activeTab === "android"
                  ? "bg-olive-light text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Smartphone size={16} />
                Chrome (Android)
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === "ios" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
              <GuideStep
                step={1}
                title="공유 버튼 탭하기"
                description="사파리 하단 메뉴바에서 공유 아이콘을 찾아 탭해주세요."
                imageSrc={`${GUIDE_BASE_URL}install2.webp`}
                icon={<Share size={20} />}
              />
              <GuideStep
                step={2}
                title="메뉴 위로 드래그"
                description="공유 시트가 열리면 아래로 스크롤하여 메뉴를 확인해주세요."
                imageSrc={`${GUIDE_BASE_URL}install3.webp`}
                icon={<ArrowLeft className="rotate-90" size={20} />}
              />
              <GuideStep
                step={3}
                title="홈 화면에 추가"
                description="'홈 화면에 추가' 버튼을 찾아 선택해주세요."
                imageSrc={`${GUIDE_BASE_URL}install4.webp`}
                icon={<Download size={20} />}
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
              <GuideStep
                step={1}
                title="공유 버튼 탭하기"
                description="크롬 브라우저 우측 상단의 공유 아이콘을 탭해주세요."
                imageSrc={`${GUIDE_BASE_URL}install1.webp`}
                // Android placeholder images or generic icons since specific ones weren't provided
                icon={<Share size={20} />}
              />
              <GuideStep
                step={2}
                title="메뉴 위로 드래그"
                description="공유 시트가 열리면 아래로 스크롤하여 메뉴를 확인해주세요."
                imageSrc={`${GUIDE_BASE_URL}install3.webp`}
                icon={<ArrowLeft className="rotate-90" size={20} />}
              />
              <GuideStep
                step={3}
                title="홈 화면에 추가"
                description="'홈 화면에 추가' 버튼을 찾아 선택해주세요."
                imageSrc={`${GUIDE_BASE_URL}install4.webp`}
                icon={<Download size={20} />}
              />
            </div>
          )}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              앱으로 사용하면 좋아요!
            </h3>
            <div className="space-y-4">
              <BenefitItem
                title="빠른 접속"
                description="홈 화면에서 바로 실행, 1초 이내 접속"
              />
              <BenefitItem
                title="AI 레시피 매일 1회 무료"
                description="앱 설치 시 AI 생성권 추가 제공"
              />
              <BenefitItem
                title="전체 화면 경험"
                description="주소창 없는 넓은 화면으로 쾌적하게"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const GuideStep = ({
  step,
  title,
  description,
  imageSrc,
  icon,
}: {
  step: number;
  title: string;
  description: string;
  imageSrc?: string;
  icon: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
    <div className="flex items-center gap-4 border-b border-gray-100 p-4">
      <div className="bg-olive-light/10 text-olive-light flex h-8 w-8 items-center justify-center rounded-full font-bold">
        {step}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
    {imageSrc ? (
      <div className="bg-gray-50 px-8 py-6">
        <div className="mx-auto max-h-[900px] overflow-hidden rounded-xl shadow-lg ring-1 ring-gray-900/5">
          <Image
            src={imageSrc}
            alt={title}
            className="h-auto w-full object-contain"
            aspectRatio="131 / 284"
          />
        </div>
      </div>
    ) : (
      <div className="flex h-32 items-center justify-center bg-gray-50 text-gray-400">
        <div className="flex flex-col items-center gap-2">
          <Smartphone size={32} className="opacity-20" />
          <span className="text-xs">이미지 준비중</span>
        </div>
      </div>
    )}
  </div>
);

const BenefitItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="bg-olive-light mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] text-white">
      <Check size={12} strokeWidth={3} />
    </div>
    <div>
      <p className="font-bold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default InstallGuidePage;
