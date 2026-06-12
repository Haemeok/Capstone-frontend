"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import * as z from "zod";

import type { YoutubeDict } from "@/shared/i18n";

import { validateYoutubeUrl } from "@/features/recipe-import-youtube/lib/urlValidation";

import { useYoutubeUrl } from "./YoutubeUrlProvider";

const buildYoutubeUrlSchema = (invalidUrl: string) =>
  z.object({
    url: z.string().refine(
      (url) => {
        if (!url.trim()) return true;
        return validateYoutubeUrl(url).valid;
      },
      { message: invalidUrl }
    ),
  });

type YoutubeUrlFormValues = z.infer<ReturnType<typeof buildYoutubeUrlSchema>>;

export const YoutubeUrlForm = ({ dict }: { dict: YoutubeDict }) => {
  const {
    setCurrentUrl,
    registerFormSetter,
    currentUrl: providerInitialUrl,
  } = useYoutubeUrl();

  const youtubeUrlSchema = buildYoutubeUrlSchema(dict.invalidUrl);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<YoutubeUrlFormValues>({
    resolver: zodResolver(youtubeUrlSchema),
    defaultValues: { url: providerInitialUrl },
    mode: "onBlur",
  });

  const currentUrl = watch("url");

  const handleClear = () => {
    setValue("url", "");
    setCurrentUrl("");
  };

  useEffect(() => {
    registerFormSetter((url: string) => {
      setValue("url", url);
    });
  }, [registerFormSetter, setValue]);

  return (
    <div className="relative mx-auto w-full transition-all duration-300 hover:-translate-y-1">
      <div
        className={`relative flex items-center overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 transition-all focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus-within:ring-2 ${
          errors.url
            ? "ring-red-500 focus-within:ring-red-500"
            : "focus-within:ring-olive-light ring-gray-100"
        }`}
      >
        <div className="pl-6 text-gray-400">
          <Search className="h-6 w-6" />
        </div>
        <input
          type="text"
          {...register("url", {
            onChange: (e) => setCurrentUrl(e.target.value),
          })}
          placeholder={dict.inputPlaceholder}
          className="text-ink w-full bg-transparent py-5 pr-12 pl-4 text-lg placeholder:text-gray-400 focus:outline-none"
          autoComplete="off"
        />
        {currentUrl && (
          <button
            type="button"
            onClick={handleClear}
            className="hover:text-ink-sub absolute right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100"
            aria-label={dict.inputClearLabel}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {errors.url && (
        <p
          className="animate-slide-up-fade mt-2 px-2 text-sm font-medium text-red-500"
          role="alert"
        >
          {errors.url.message}
        </p>
      )}
    </div>
  );
};
