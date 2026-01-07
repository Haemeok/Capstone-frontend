import { Share2, Link, Clipboard } from "lucide-react";

export const UsageGuide = () => {
  const steps = [
    {
      icon: Share2,
      title: "공유 버튼 클릭",
      desc: "유튜브 앱에서 공유를 눌러주세요",
    },
    {
      icon: Link,
      title: "링크 복사 선택",
      desc: "링크 복사 버튼을 찾아주세요",
    },
    {
      icon: Clipboard,
      title: "여기에 붙여넣기",
      desc: "입력창에 붙여넣으면 끝!",
    },
  ];

  return (
    <div className="mx-auto mt-12 mb-8 w-full max-w-2xl">
      <h3 className="text-dark mb-6 text-center text-lg font-bold">
        어떻게 하는 건가요?
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border-olive-light/30 flex items-center space-y-3 rounded-xl border bg-white p-4 text-center"
          >
            <div className="bg-beige text-olive-medium flex h-12 w-12 items-center justify-center rounded-full">
              <step.icon size={24} />
            </div>
            <div>
              <p className="text-dark mb-1 font-semibold">{step.title}</p>
              <p className="text-olive-medium/80 text-sm">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
