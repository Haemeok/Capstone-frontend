"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  ARCHETYPE_RESULTS,
  getIndex,
  imageUrl,
} from "../model/archeTypeResult";
import { robotoMono, alegreya, notoSerifKR } from "./fonts";

type ShareCardProps = {
  id: string;
  result: keyof typeof ARCHETYPE_RESULTS;
};

const ShareCard = ({ id, result }: ShareCardProps) => {
  const resultData = ARCHETYPE_RESULTS[result];

  const formatDateTime = () => {
    const now = new Date();
    const date = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${now.getFullYear()}`;
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return `${date} ${time}`;
  };

  const firstGood = ARCHETYPE_RESULTS[resultData.match.good[0]].header.title;
  const secondGood = ARCHETYPE_RESULTS[resultData.match.good[1]].header.title;
  const firstBad = ARCHETYPE_RESULTS[resultData.match.bad[0]].header.title;
  const secondBad = ARCHETYPE_RESULTS[resultData.match.bad[1]].header.title;

  return (
    <div
      id={id}
      className={`flex min-h-0 w-full flex-col bg-[#F4F1EA] px-8 py-10 ${notoSerifKR.variable} ${robotoMono.variable} ${alegreya.variable}`}
    >
      <div
        className="mb-8 flex items-center justify-between text-sm font-medium tracking-wide text-gray-800"
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

        <div className="mt-4 space-y-2">
          <h2
            className="px-4 text-2xl leading-tight font-bold tracking-wide text-gray-900"
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

      <div className="mb-4 border-t border-gray-800 pt-3 text-center">
        <span
          className="font-medium tracking-wide text-gray-800"
          style={{ fontFamily: "var(--font-alegreya), serif" }}
        >
          DATE: {formatDateTime()}
        </span>
      </div>

      <div className="mb-2 flex justify-center">
        <div className="relative p-1">
          <div
            className="pointer-events-none absolute inset-0 border border-gray-400"
            style={{
              margin: "-4px",
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
            <img
              src={imageUrl(resultData.code)}
              alt={resultData.header.title}
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "contrast(1.05) sepia(0.1)",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="mb-2 flex justify-center gap-6 font-medium"
        style={{ fontFamily: "var(--font-alegreya), serif" }}
      >
        <span>{`#${resultData.tags[0]}`}</span>
        <span>{`#${resultData.tags[1]}`}</span>
      </div>

      <div className="mb-4 px-3">
        <p
          className="text-justify text-[15px] leading-7 break-keep text-gray-700"
          style={{
            fontFamily: "var(--font-pretendard), sans-serif",
            wordSpacing: "-0.05em",
          }}
        >
          {resultData.cardDescription}
        </p>
      </div>

      <div className="border-t border-gray-800"></div>

      <div
        className="mt-4 mb-4 flex items-center gap-5 px-2"
        style={{ fontFamily: "var(--font-pretendard), serif" }}
      >
        <div
          className="h-16 w-16 flex-shrink-0 rounded-full border border-gray-300"
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
          <div className="text-sm text-gray-600">{resultData.color.hex}</div>
          <div className="mt-1 text-sm leading-tight text-gray-700">
            {resultData.color.description}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800"></div>

      <div className="mt-4 mb-4 space-y-6 px-2">
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

      <div className="border-t border-gray-800"></div>

      <div className="mt-4 flex items-center justify-between px-4">
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
    </div>
  );
};

export default ShareCard;
