"use client";

import { useEffect } from "react";
import { Image } from "@/shared/ui/image/Image";
import {
  ARCHETYPE_RESULTS,
  getIndex,
  imageUrl,
} from "../model/archeTypeResult";
import ShareCard from "./ShareCard";
import { useShareImage } from "./hooks/useShareImage";
import { QRCodeSVG } from "qrcode.react";
import { RotateCcw } from "lucide-react";
import { robotoMono, alegreya, notoSerifKR } from "./fonts";
import Link from "next/link";

type ArchetypeResultProps = {
  result: keyof typeof ARCHETYPE_RESULTS;
};

const ArchetypeResult = ({ result }: ArchetypeResultProps) => {
  const { generateImage, downloadImage, isLoading } = useShareImage(
    "archetype-share-card"
  );

  const resultData = ARCHETYPE_RESULTS[result];

  useEffect(() => {
    const timer = setTimeout(() => {
      generateImage();
    }, 500);

    return () => clearTimeout(timer);
  }, [generateImage]);

  const formatDateTime = () => {
    const now = new Date();
    const date = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${now.getFullYear()}`;
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return `${date} ${time}`;
  };

  const cleanText = (text: string) => text.replace(/\*\*/g, "");

  const firstGood = ARCHETYPE_RESULTS[resultData.match.good[0]].header.title;
  const secondGood = ARCHETYPE_RESULTS[resultData.match.good[1]].header.title;
  const firstBad = ARCHETYPE_RESULTS[resultData.match.bad[0]].header.title;
  const secondBad = ARCHETYPE_RESULTS[resultData.match.bad[1]].header.title;

  return (
    <>
      <div
        className={`flex items-center justify-center ${notoSerifKR.variable} ${robotoMono.variable} ${alegreya.variable} bg-white`}
      >
        <div
          className="relative w-full max-w-xl bg-[#F4F1EA] p-8 text-gray-900"
          style={{
            fontFamily: "var(--font-alegreya), serif",
          }}
        >
          <div
            className="mb-8 flex items-center justify-between font-medium tracking-wide text-gray-800"
            style={{ fontFamily: "var(--font-alegreya), monospace" }}
          >
            <span>ORDER TICKET</span>
            <span>
              No. {String(getIndex(resultData.code) + 1).padStart(3, "0")}
            </span>
          </div>

          <div className="mb-4 text-center">
            <div
              className="text-6xl tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-alegreya), serif" }}
            >
              RECIPIO
            </div>
            <div
              className="mt-1 text-sm font-light tracking-widest text-gray-700 uppercase"
              style={{ fontFamily: "var(--font-roboto-mono), monospace" }}
            >
              Fine Dining
            </div>

            <div className="mt-2 space-y-2">
              <h2
                className="px-4 text-2xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-noto-serif-kr), serif" }}
              >
                {resultData.header.title}
              </h2>
              <p
                className="font-medium text-gray-700"
                style={{ fontFamily: "var(--font-alegreya), serif" }}
              >
                {resultData.header.subtitle}
              </p>
            </div>
          </div>

          <div className="mb-6 border-t border-gray-800 pt-3 text-center">
            <span className="font-medium tracking-wide text-gray-800">
              DATE: {formatDateTime()}
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative p-1">
                <div
                  className="pointer-events-none absolute inset-0 border border-gray-400"
                  style={{
                    margin: "-6px",
                    borderRadius: "4px",
                    clipPath:
                      "polygon(0 15px, 15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px))",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-0 border border-gray-800"
                  style={{
                    clipPath:
                      "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                />

                <div
                  className="overflow-hidden"
                  style={{
                    width: "280px",
                    height: "280px",
                    clipPath:
                      "polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                >
                  <Image
                    src={imageUrl(resultData.code)}
                    alt={resultData.header.title}
                    wrapperClassName="w-full h-full"
                    style={{
                      filter: "contrast(1.05) sepia(0.1)",
                    }}
                    priority={false}
                  />
                </div>
              </div>
            </div>

            <div
              className="flex justify-center gap-6 font-medium"
              style={{ fontFamily: "var(--font-alegreya), serif" }}
            >
              <span>{`#${resultData.tags[0]}`}</span>
              <span>{`#${resultData.tags[1]}`}</span>
            </div>

            <div className="border-t border-gray-800"></div>

            <div
              className="space-y-3 px-2"
              style={{ fontFamily: "var(--font-pretendard), serif" }}
            >
              {resultData.description.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start text-base leading-relaxed"
                >
                  <span className="w-6 flex-shrink-0 font-medium">
                    {String(index + 1)}.
                  </span>
                  <div className="flex flex-1 items-end justify-between">
                    <span className="text-gray-800">{cleanText(item)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800"></div>

            <div
              className="flex items-center gap-5 px-2"
              style={{ fontFamily: "var(--font-pretendard), serif" }}
            >
              <div
                className="h-16 w-16 flex-shrink-0 rounded-full border border-gray-300 shadow-sm"
                style={{
                  backgroundColor: resultData.color.hex,
                }}
              />
              <div className="flex-1">
                <div
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-alegreya), serif" }}
                >
                  {resultData.color.name}
                </div>
                <div className="text-sm text-gray-600">
                  {resultData.color.hex}
                </div>
                <div className="mt-1 text-sm leading-tight text-gray-700">
                  {resultData.color.description}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800"></div>

            <div
              className="space-y-3 px-2 text-base leading-relaxed"
              style={{ fontFamily: "var(--font-pretendard), serif" }}
            >
              <div
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-alegreya), serif" }}
              >
                History & Story
              </div>
              <p className="text-gray-800">{resultData.history}</p>
            </div>

            <div className="border-t border-gray-800"></div>

            <div className="space-y-6 px-2">
              <div
                className="flex items-center gap-6 pr-8 text-base"
                style={{ fontFamily: "var(--font-alegreya), serif" }}
              >
                <div className="flex flex-col items-center justify-center text-xl font-bold tracking-wide">
                  <p>BEST</p>
                  <p>MATCH</p>
                </div>
                <div
                  className="flex grow flex-col text-gray-700"
                  style={{ fontFamily: "var(--font-pretendard), serif" }}
                >
                  <p className="leading-snug">• {firstGood}</p>
                  <div className="my-1 border-b border-dotted border-gray-200 opacity-50"></div>
                  <p className="leading-snug">• {secondGood}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-6 pr-8 text-base"
                style={{ fontFamily: "var(--font-alegreya), serif" }}
              >
                <div className="flex flex-col items-center justify-center text-xl font-bold tracking-wide">
                  <p>WORST</p>
                  <p>MATCH</p>
                </div>
                <div
                  className="flex grow flex-col text-gray-700"
                  style={{ fontFamily: "var(--font-pretendard), serif" }}
                >
                  <p className="leading-snug">• {firstBad}</p>
                  <div className="my-1 border-b border-dotted border-gray-200 opacity-50"></div>
                  <p className="leading-snug">• {secondBad}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between px-4">
              <div
                className="-mb-2 text-4xl text-gray-900"
                style={{ fontFamily: "var(--font-alegreya), serif" }}
              >
                RECIPIO
              </div>

              <div className="flex flex-col items-center">
                <QRCodeSVG
                  value="https://recipio.kr/archetype"
                  size={64}
                  level="L"
                  fgColor="#1F2937"
                  bgColor="transparent"
                />
              </div>
            </div>

            <div className="border-t border-gray-800"></div>

            <div
              className="mt-8 flex items-center justify-center gap-4"
              style={{ fontFamily: "var(--font-pretendard), serif" }}
            >
              <Link
                href="/archetype"
                className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                다시하기
              </Link>
              <button
                onClick={downloadImage}
                className="cursor-pointer rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-gray-800"
              >
                {isLoading ? "티켓 발권 중..." : "티켓 저장하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed top-0 left-0 opacity-0">
        <ShareCard id="archetype-share-card" result={result} />
      </div>
    </>
  );
};

export default ArchetypeResult;
