import Circle from "@/shared/ui/Circle";

type GridFooterProps = {
  observerRef?: (node: Element | null) => void;
  hasNextPage?: boolean;
  isFetching?: boolean;
  nextPageHref?: string;
  showLastPageMessage: boolean;
  lastPageMessage: string;
};

const GridFooter = ({
  observerRef,
  hasNextPage,
  isFetching,
  nextPageHref,
  showLastPageMessage,
  lastPageMessage,
}: GridFooterProps) => (
  <>
    <div
      ref={observerRef}
      className="relative mt-2 flex h-10 items-center justify-center"
    >
      {nextPageHref && hasNextPage && (
        <a href={nextPageHref} className="sr-only" tabIndex={-1}>
          다음 페이지
        </a>
      )}
      {showLastPageMessage && (
        <p className="text-ink-muted text-sm">{lastPageMessage}</p>
      )}
    </div>
    {isFetching && (
      <div className="flex items-center justify-center py-5">
        <Circle className="text-olive-light h-10 w-10" />
      </div>
    )}
  </>
);

export default GridFooter;
