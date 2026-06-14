"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { useCookingUnitsDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

type CookingUnitTooltipProps = {
  inline?: boolean;
};

const CookingUnitTooltip = ({ inline = false }: CookingUnitTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dict = useCookingUnitsDict();
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
      className="text-ink-muted hover:text-ink-sub inline-flex cursor-pointer items-center gap-1 text-sm underline-offset-4 transition-colors hover:underline"
    >
      {dict.tableTrigger}
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
            <Title className="text-ink text-xl font-bold">
              {dict.tableTitle}
            </Title>
            <Description className="text-ink-muted text-sm">
              {dict.tableDescription}
            </Description>
          </Header>

          <div className="px-4 pb-6">
            <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
              {dict.conversions.map((item) => (
                <li key={item.unit} className="flex flex-col gap-0.5 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-ink font-bold">{item.unit}</span>
                    <span className="text-ink font-semibold tabular-nums">
                      {item.value}
                    </span>
                  </div>
                  <span className="text-ink-muted text-xs">{item.tip}</span>
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
