import PrevButton from "@/shared/ui/PrevButton";

type DailyCookingRecordHeaderProps = {
  title: string;
};

export const DailyCookingRecordHeader = ({
  title,
}: DailyCookingRecordHeaderProps) => (
  <header className="grid grid-cols-[44px_1fr_44px] items-center px-4 py-2">
    <PrevButton className="size-11 cursor-pointer" size={22} showOnDesktop />
    <h1 className="text-ink text-center text-lg font-bold">{title}</h1>
    <span aria-hidden="true" />
  </header>
);
