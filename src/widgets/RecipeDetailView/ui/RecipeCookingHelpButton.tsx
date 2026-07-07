"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { useCookingHelpDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import CookingUnitConversionList from "@/shared/ui/CookingUnitConversionList";

type RecipeCookingHelpButtonProps = {
  tips: string | undefined;
};

const RecipeCookingHelpButton = ({ tips }: RecipeCookingHelpButtonProps) => {
  const dict = useCookingHelpDict();
  const { Container, Content, Header, Title } = useResponsiveSheet();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    triggerHaptic("Light");
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-olive-light mt-4 mb-6 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-gray-200 bg-white py-4 text-sm font-semibold transition-colors active:bg-gray-50"
      >
        {dict.buttonLabel}
        <ChevronRight size={16} className="text-gray-400" />
      </button>

      <Container open={isOpen} onOpenChange={setIsOpen}>
        <Content className="sm:max-w-md">
          <Header>
            <Title className="text-ink text-lg font-bold">
              {dict.sheetTitle}
            </Title>
          </Header>

          <div className="flex flex-col gap-6 px-4 pb-6">
            <section className="flex flex-col gap-2.5">
              <h3 className="text-ink text-sm font-semibold">
                {dict.tableTab}
              </h3>
              <CookingUnitConversionList />
            </section>

            {tips && (
              <section className="flex flex-col gap-2.5">
                <h3 className="text-ink text-sm font-semibold">
                  {dict.tipsTab}
                </h3>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-ink-sub text-sm leading-6 whitespace-pre-wrap">
                    {tips}
                  </p>
                </div>
              </section>
            )}
          </div>
        </Content>
      </Container>
    </>
  );
};

export default RecipeCookingHelpButton;
