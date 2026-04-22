// src/features/landing/ui/TagChipsSection.tsx
"use client";

import Link from "next/link";

import { motion } from "motion/react";

import {
  buildTagSearchUrl,
  LANDING_TAG_GROUPS,
} from "@/features/landing/config/landingTags";

const CHIP_STAGGER_DELAY = 0.03;

export const TagChipsSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-12 md:py-20">
      <div className="bg-olive-mint/5 absolute top-1/3 right-0 h-80 w-80 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="bg-olive-light/10 text-olive-medium mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold">
            상황별 레시피
          </div>
          <h2 className="text-dark mb-4 text-4xl font-extrabold md:text-5xl">
            이런 날에도, 이런 상황에도
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            원하는 상황에 딱 맞는 레시피를 바로 찾아보세요
          </p>
        </motion.div>

        <div className="space-y-8">
          {LANDING_TAG_GROUPS.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6"
            >
              <div className="flex items-center gap-2 md:w-52 md:shrink-0">
                <span className="text-2xl">{group.emoji}</span>
                <span className="text-dark text-base font-bold md:text-lg">
                  {group.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {group.chips.map((chip, index) => (
                  <motion.div
                    key={chip.code}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: index * CHIP_STAGGER_DELAY,
                    }}
                  >
                    <Link
                      href={buildTagSearchUrl(chip.code)}
                      className="hover:border-olive-light hover:bg-olive-light/10 hover:text-olive-medium inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all active:scale-[0.97] md:text-base"
                    >
                      # {chip.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
