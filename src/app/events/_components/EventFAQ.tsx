import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type EventFAQProps = {
  items: FaqItem[];
};

const EventFAQ = ({ items }: EventFAQProps) => {
  return (
    <section className="px-4 py-6">
      <h2 className="mb-3 text-lg font-bold text-gray-900">자주 묻는 질문</h2>
      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item) => (
          <li key={item.question}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown
                  size={18}
                  className="shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-gray-600">
                {item.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EventFAQ;
