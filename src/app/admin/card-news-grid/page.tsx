"use client";

import { useRef, useState } from "react";

import { saveAllCards } from "@/app/admin/card-news/lib/capture";

import { GridTipCard } from "./components/GridTipCard";
import { MODEL_OPTIONS } from "./lib/schema";
import { useGridCardNews } from "./lib/useGridCardNews";

export default function CardNewsGridPage() {
  const {
    modelId, setModelId, status, error,
    topics, header, setHeader, items, imageUrl,
    generateTopics, generateItems, generateImage, updateItem,
  } = useGridCardNews();
  const [seed, setSeed] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const onCapture = () => {
    if (!cardRef.current) return;
    saveAllCards([cardRef], [`${header || "grid-tip"}.png`], "card-news-grid");
  };

  return (
    <main style={{ display: "flex", gap: 24, padding: 24, alignItems: "flex-start" }}>
      <section style={{ width: 420, display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>요리팁 9그리드 카드뉴스</h1>

        <label style={{ fontSize: 14 }}>
          콘텐츠 모델
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {MODEL_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="시드 키워드 (선택)"
            style={{ flex: 1 }}
          />
          <button type="button" onClick={() => generateTopics(seed)} className="cursor-pointer">
            주제 후보
          </button>
        </div>

        {topics.length > 0 && (
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topics.map((t, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => generateItems(t.title)}
                  className="cursor-pointer"
                  style={{ textAlign: "left", width: "100%" }}
                >
                  <strong>{t.title}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>{t.concept}</div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <>
            <input value={header} onChange={(e) => setHeader(e.target.value)} placeholder="헤더" />
            {items.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: 6 }}>
                <input
                  value={it.dishName}
                  onChange={(e) => updateItem(i, { dishName: e.target.value })}
                  style={{ width: 110 }}
                />
                <input
                  value={it.caption}
                  onChange={(e) => updateItem(i, { caption: e.target.value })}
                  style={{ flex: 1 }}
                />
              </div>
            ))}
            <button type="button" onClick={generateImage} className="cursor-pointer">
              이미지 생성
            </button>
          </>
        )}

        {imageUrl && (
          <button type="button" onClick={onCapture} className="cursor-pointer">
            카드 캡처/저장
          </button>
        )}

        {status === "loading" && <p>생성 중…</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </section>

      <section style={{ transform: "scale(0.5)", transformOrigin: "top left" }}>
        {imageUrl && items.length === 9 && (
          <GridTipCard ref={cardRef} header={header} imageUrl={imageUrl} items={items} />
        )}
      </section>
    </main>
  );
}
