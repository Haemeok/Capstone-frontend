"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

type UnitConversion = {
  unit: string;
  value: string;
  tip: string;
};

const UNIT_CONVERSIONS: UnitConversion[] = [
  { unit: "1큰술 (1T)", value: "15ml", tip: "밥숟가락 약 2번" },
  { unit: "1작은술 (1t)", value: "5ml", tip: "티스푼 1개" },
  { unit: "1컵 (1C)", value: "200ml", tip: "종이컵 가득은 약 180ml" },
];

type CookingUnitTooltipProps = {
  inline?: boolean;
};

const CookingUnitTooltip = ({ inline = false }: CookingUnitTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { Container, Content, Header, Title, Description } =
    useResponsiveSheet();

  const handleOpen = () => {
    triggerHaptic("Light");
    setIsOpen(true);
  };

  const triggerButton = (
    <button
      type="button"
      onClick={handleOpen}
      className="inline-flex cursor-pointer items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700 hover:underline underline-offset-4"
    >
      요리 단위 변환표
      <ChevronRight size={14} />
    </button>
  );

  return (
    <>
      {inline ? (
        triggerButton
      ) : (
        <div className="my-4 flex justify-center">{triggerButton}</div>
      )}

      <Container open={isOpen} onOpenChange={setIsOpen}>
        <Content className="sm:max-w-md">
          <Header>
            <Title className="text-xl font-bold text-gray-900">
              요리 단위 변환표
            </Title>
            <Description className="text-sm text-gray-500">
              레시피에 자주 나오는 계량 단위를 확인해보세요
            </Description>
          </Header>

          <div className="px-4 pb-6">
            <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
              {UNIT_CONVERSIONS.map((item) => (
                <li key={item.unit} className="flex flex-col gap-0.5 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-gray-900">
                      {item.unit}
                    </span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {item.value}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{item.tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </Content>
      </Container>
    </>
  );
};

export default CookingUnitTooltip;
