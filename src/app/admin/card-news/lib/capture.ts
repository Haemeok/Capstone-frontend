// src/app/admin/card-news/lib/capture.ts
import { toBlob } from "html-to-image";

declare global {
  interface Window {
    showDirectoryPicker?: (options?: {
      mode?: "read" | "readwrite";
    }) => Promise<FileSystemDirectoryHandle>;
  }
}

const SCALE = 3;

export const captureElement = async (element: HTMLElement): Promise<Blob> => {
  const blob = await toBlob(element, {
    pixelRatio: SCALE,
    cacheBust: true,
    skipAutoScale: true,
    backgroundColor: undefined,
  });

  if (!blob) throw new Error("toBlob returned null");
  return blob;
};

export const saveAllCards = async (
  cardRefs: React.RefObject<HTMLDivElement | null>[],
  fileNames: string[],
  folderName: string,
) => {
  await document.fonts.ready;

  // File System Access API 지원 확인
  if (!("showDirectoryPicker" in window)) {
    // fallback: 개별 다운로드
    for (let i = 0; i < cardRefs.length; i++) {
      const el = cardRefs[i].current;
      if (!el) continue;
      const blob = await captureElement(el);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileNames[i];
      a.click();
      URL.revokeObjectURL(url);
    }
    return;
  }

  // 루트 폴더 선택
  const rootHandle = await window.showDirectoryPicker!({ mode: "readwrite" });

  // 하위 폴더 생성
  const subHandle = await rootHandle.getDirectoryHandle(folderName, {
    create: true,
  });

  // 각 카드 캡처 + 저장
  for (let i = 0; i < cardRefs.length; i++) {
    const el = cardRefs[i].current;
    if (!el) continue;

    const blob = await captureElement(el);
    const fileHandle = await subHandle.getFileHandle(fileNames[i], {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  }
};
