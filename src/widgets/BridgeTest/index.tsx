"use client";

import { useState, useEffect } from "react";

import {
  isAppWebView,
  postMessage,
  triggerHaptic,
  triggerNativeShare,
} from "@/shared/lib/bridge";
import type { HapticStyle, BridgeMessageType } from "@/shared/lib/bridge";

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
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="px-3 py-2 bg-purple-500 text-white text-xs rounded shadow-lg hover:bg-purple-600"
        >
          Bridge
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">Bridge 테스트</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* 상태 표시 */}
      <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>WebView: 감지됨</span>
        </div>
        <div className="text-gray-500 mt-1">환경: {process.env.NODE_ENV}</div>
      </div>

      {/* Haptic 테스트 */}
      <div className="mb-4">
        <h4 className="text-xs font-medium mb-2">Haptic (진동)</h4>
        <div className="grid grid-cols-3 gap-1">
          {HAPTIC_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => handleHaptic(style)}
              className="px-2 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded"
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Share 테스트 */}
      <div className="mb-4">
        <h4 className="text-xs font-medium mb-2">Share (공유)</h4>
        <div className="space-y-1">
          <input
            type="text"
            value={shareTitle}
            onChange={(e) => setShareTitle(e.target.value)}
            placeholder="title"
            className="w-full px-2 py-1 text-xs border rounded"
          />
          <input
            type="text"
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            placeholder="text"
            className="w-full px-2 py-1 text-xs border rounded"
          />
          <input
            type="text"
            value={shareUrl}
            onChange={(e) => setShareUrl(e.target.value)}
            placeholder="url"
            className="w-full px-2 py-1 text-xs border rounded"
          />
          <button
            onClick={handleShare}
            className="w-full px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
          >
            공유 트리거
          </button>
        </div>
      </div>

      {/* Raw postMessage 테스트 */}
      <div className="mb-4">
        <h4 className="text-xs font-medium mb-2">Raw postMessage</h4>
        <div className="space-y-1">
          <select
            value={rawType}
            onChange={(e) => setRawType(e.target.value as BridgeMessageType)}
            className="w-full px-2 py-1 text-xs border rounded"
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
            className="w-full px-2 py-1 text-xs border rounded font-mono h-16"
          />
          <button
            onClick={handleRawMessage}
            className="w-full px-2 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded"
          >
            전송
          </button>
        </div>
      </div>

      {/* 마지막 메시지 */}
      {lastMessage && (
        <div className="p-2 bg-gray-100 rounded text-xs font-mono break-all">
          <div className="text-gray-500 mb-1">마지막 전송:</div>
          {lastMessage}
        </div>
      )}
    </div>
  );
};
