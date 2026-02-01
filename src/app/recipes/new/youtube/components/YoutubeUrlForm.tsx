"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import * as z from "zod";

import { validateYoutubeUrl } from "@/features/recipe-import-youtube/lib/urlValidation";

import { useYoutubeUrl } from "./YoutubeUrlProvider";

const youtubeUrlSchema = z.object({
  url: z.string().refine(
    (url) => {
      if (!url.trim()) return true;
      const result = validateYoutubeUrl(url);
      return result.valid;
    },
    { message: "올바른 유튜브 링크를 입력해주세요" }
  ),
});

type YoutubeUrlFormValues = z.infer<typeof youtubeUrlSchema>;

export const YoutubeUrlForm = () => {
  const { setCurrentUrl, registerFormSetter } = useYoutubeUrl();

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<YoutubeUrlFormValues>({
    resolver: zodResolver(youtubeUrlSchema),
    defaultValues: { url: "" },
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
          placeholder="유튜브 링크를 붙여넣으세요"
          className="w-full bg-transparent py-5 pl-4 pr-12 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
          autoComplete="off"
        />
        {currentUrl && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="입력 지우기"
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
