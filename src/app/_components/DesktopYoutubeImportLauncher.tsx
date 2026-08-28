"use client";

import { type ReactNode, useState } from "react";
import dynamic from "next/dynamic";

import type { HomeDict } from "@/shared/i18n";

import { validateYoutubeUrl } from "@/features/recipe-import-youtube/lib/urlValidation";

import { DesktopYoutubeImportForm } from "./DesktopYoutubeImportForm";

const DesktopYoutubeImportFlow = dynamic(
  () =>
    import("./DesktopYoutubeImportFlow").then(
      (mod) => mod.DesktopYoutubeImportFlow
    ),
  { ssr: false }
);

type DesktopYoutubeImportLauncherProps = {
  messages: HomeDict["desktopYoutubeImport"];
  copy: ReactNode;
  initialPreview: ReactNode;
};

export const DesktopYoutubeImportLauncher = ({
  messages,
  copy,
  initialPreview,
}: DesktopYoutubeImportLauncherProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validatedInput, setValidatedInput] = useState<{
    url: string;
    videoId: string;
  } | null>(null);

  const openValidatedUrl = (value: string) => {
    const result = validateYoutubeUrl(value);

    if (!result.valid) {
      setUrl(value);
      setError(value.trim() ? messages.invalidUrl : null);
      setValidatedInput(null);
      setIsModalOpen(false);
      return;
    }

    setUrl(result.cleanUrl);
    setError(null);
    setValidatedInput({ url: result.cleanUrl, videoId: result.videoId });
    setIsModalOpen(true);
  };

  const handleChange = (value: string) => {
    setUrl(value);
    setError(null);

    const result = validateYoutubeUrl(value);
    if (result.valid) openValidatedUrl(value);
  };

  const handleFocus = () => {
    if (validatedInput) setIsModalOpen(true);
  };

  return (
    <>
      <div className="mx-auto grid min-h-[405px] w-full max-w-6xl items-center gap-10 px-6 py-11 lg:grid-cols-[minmax(430px,1.05fr)_minmax(430px,0.95fr)] lg:gap-12">
        <div className="max-w-[560px]">
          {copy}
          <DesktopYoutubeImportForm
            messages={messages}
            value={url}
            error={error}
            onChange={handleChange}
            onPaste={openValidatedUrl}
            onFocus={handleFocus}
          />
        </div>
        {initialPreview}
      </div>

      {validatedInput ? (
        <DesktopYoutubeImportFlow
          messages={messages}
          initialUrl={validatedInput.url}
          initialVideoId={validatedInput.videoId}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      ) : null}
    </>
  );
};
