"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { triggerHaptic } from "@/shared/lib/bridge";

type FaqItem = {
  question: string;
  answer: string;
};

type EventFAQProps = {
  items: FaqItem[];
};

const EventFAQ = ({ items }: EventFAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    triggerHaptic("Light");
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="px-4 py-6">
      <h2 className="text-ink mb-3 text-lg font-bold">자주 묻는 질문</h2>
      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <li key={item.question}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => handleToggle(index)}
                className="text-ink flex w-full cursor-pointer items-center justify-between gap-3 py-4 text-left text-sm font-medium"
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-ink-sub pb-4 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default EventFAQ;
