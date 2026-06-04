"use client";

import { useEffect, useState } from "react";

import type { BridgeMessageType, HapticStyle } from "@/shared/lib/bridge";
import {
  isAppWebView,
  postMessage,
  triggerHaptic,
  triggerNativeShare,
} from "@/shared/lib/bridge";

const HAPTIC_STYLES: HapticStyle[] = [
  "Light",
  "Medium",
  "Heavy",
  "Success",
  "Warning",
  "Error",
];

const MESSAGE_TYPES: BridgeMessageType[] = [
  "HAPTIC",
  "NAVIGATION",
  "SHARE",
  "STORAGE",
];

export const BridgeTest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isWebView, setIsWebView] = useState(false);
  const [shareTitle, setShareTitle] = useState("테스트 제목");
  const [shareText, setShareText] = useState("테스트 내용입니다");
  const [shareUrl, setShareUrl] = useState("https://recipio.kr");
  const [rawType, setRawType] = useState<BridgeMessageType>("HAPTIC");
  const [rawPayload, setRawPayload] = useState('{"style": "Light"}');
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    setIsWebView(isAppWebView());
  }, []);

  if (!isWebView) {
    return null;
  }

  const handleHaptic = (style: HapticStyle) => {
    triggerHaptic(style);
    setLastMessage(`HAPTIC: ${style}`);
  };

  const handleShare = () => {
    triggerNativeShare({
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    });
    setLastMessage(`SHARE: ${shareTitle}`);
  };

  const handleRawMessage = () => {
    try {
      const payload = JSON.parse(rawPayload);
      postMessage(rawType, payload);
      setLastMessage(`RAW: ${rawType} - ${rawPayload}`);
    } catch {
      setLastMessage("JSON 파싱 에러");
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed right-4 bottom-20 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="rounded bg-purple-500 px-3 py-2 text-xs text-white shadow-lg hover:bg-purple-600"
        >
          Bridge
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 max-h-[80vh] w-80 overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">Bridge 테스트</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* 상태 표시 */}
      <div className="mb-3 rounded bg-gray-50 p-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>WebView: 감지됨</span>
        </div>
        <div className="mt-1 text-gray-500">환경: {process.env.NODE_ENV}</div>
      </div>

      {/* Haptic 테스트 */}
      <div className="mb-4">
        <h4 className="mb-2 text-xs font-medium">Haptic (진동)</h4>
        <div className="grid grid-cols-3 gap-1">
          {HAPTIC_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => handleHaptic(style)}
              className="rounded bg-blue-100 px-2 py-1.5 text-xs text-blue-700 hover:bg-blue-200"
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Share 테스트 */}
      <div className="mb-4">
        <h4 className="mb-2 text-xs font-medium">Share (공유)</h4>
        <div className="space-y-1">
          <input
            type="text"
            value={shareTitle}
            onChange={(e) => setShareTitle(e.target.value)}
            placeholder="title"
            className="w-full rounded border px-2 py-1 text-xs"
          />
          <input
            type="text"
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            placeholder="text"
            className="w-full rounded border px-2 py-1 text-xs"
          />
          <input
            type="text"
            value={shareUrl}
            onChange={(e) => setShareUrl(e.target.value)}
            placeholder="url"
            className="w-full rounded border px-2 py-1 text-xs"
          />
          <button
            onClick={handleShare}
            className="w-full rounded bg-green-500 px-2 py-1.5 text-xs text-white hover:bg-green-600"
          >
            공유 트리거
          </button>
        </div>
      </div>

      {/* Raw postMessage 테스트 */}
      <div className="mb-4">
        <h4 className="mb-2 text-xs font-medium">Raw postMessage</h4>
        <div className="space-y-1">
          <select
            value={rawType}
            onChange={(e) => setRawType(e.target.value as BridgeMessageType)}
            className="w-full rounded border px-2 py-1 text-xs"
          >
            {MESSAGE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <textarea
            value={rawPayload}
            onChange={(e) => setRawPayload(e.target.value)}
            placeholder='{"key": "value"}'
            className="h-16 w-full rounded border px-2 py-1 font-mono text-xs"
          />
          <button
            onClick={handleRawMessage}
            className="w-full rounded bg-orange-500 px-2 py-1.5 text-xs text-white hover:bg-orange-600"
          >
            전송
          </button>
        </div>
      </div>

      {/* 마지막 메시지 */}
      {lastMessage && (
        <div className="rounded bg-gray-100 p-2 font-mono text-xs break-all">
          <div className="mb-1 text-gray-500">마지막 전송:</div>
          {lastMessage}
        </div>
      )}
    </div>
  );
};
