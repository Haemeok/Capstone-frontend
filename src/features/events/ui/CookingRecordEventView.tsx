import EventPageShell from "./EventPageShell";

export const CookingRecordEventView = () => (
  <EventPageShell
    title="요리기록"
    hero={
      <section className="bg-[#eef3e9] px-5 pt-9 pb-10 text-center">
        <p className="text-olive-medium text-xs font-semibold">
          새로 나온 요리기록
        </p>
        <h2 className="text-ink mt-2 text-[28px] leading-[1.3] font-bold tracking-[-0.04em]">
          요리한 오늘이
          <span className="block">나만의 기록이 돼요</span>
        </h2>
        <img
          src="/events/cooking-record/food-cluster.webp"
          alt="요리기록을 채우는 여러 음식"
          width={640}
          height={960}
          className="mx-auto -mt-16 -mb-24 h-[360px] w-[240px] object-contain"
        />
        <p className="text-ink-sub text-sm leading-6">
          사진 한 장과 짧은 메모로 오늘의 요리를 남겨보세요.
        </p>
      </section>
    }
  >
    <section className="px-5 py-9">
      <h2 className="text-ink text-xl font-bold">요리한 날을 차곡차곡</h2>
      <p className="text-ink-sub mt-2 text-sm leading-6">
        남긴 기록은 달력에서 언제든 다시 찾을 수 있어요.
      </p>
    </section>
  </EventPageShell>
);
