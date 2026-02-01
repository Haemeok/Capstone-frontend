"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDebounce } from "@/shared/hooks/useDebounce";

import { validateYoutubeUrl } from "@/features/recipe-import-youtube/lib/urlValidation";

type FormValueSetter = (url: string) => void;

type UrlSource = "direct" | "trending" | null;

type YoutubeUrlContextValue = {
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  debouncedUrl: string;
  validatedUrl: string | null;
  videoId: string | null;
  registerFormSetter: (setter: FormValueSetter) => void;
  selectTrendingRecipe: (url: string) => void;
  urlSource: UrlSource;
};

const YoutubeUrlContext = createContext<YoutubeUrlContextValue | null>(null);

const DEBOUNCE_DELAY_MS = 500;

type YoutubeUrlProviderProps = {
  children: ReactNode;
};

export const YoutubeUrlProvider = ({ children }: YoutubeUrlProviderProps) => {
  const [currentUrl, setCurrentUrlState] = useState("");
  const [urlSource, setUrlSource] = useState<UrlSource>(null);
  const debouncedUrl = useDebounce(currentUrl, DEBOUNCE_DELAY_MS);
  const formSetterRef = useRef<FormValueSetter | null>(null);

  const setCurrentUrl = useCallback((url: string) => {
    setCurrentUrlState(url);
    setUrlSource(url.trim() ? "direct" : null);
  }, []);

  const registerFormSetter = useCallback((setter: FormValueSetter) => {
    formSetterRef.current = setter;
  }, []);

  const selectTrendingRecipe = useCallback((url: string) => {
    if (formSetterRef.current) {
      formSetterRef.current(url);
    }
    setCurrentUrlState(url);
    setUrlSource("trending");
  }, []);

  const validatedUrlResult = useMemo(
    () => validateYoutubeUrl(debouncedUrl),
    [debouncedUrl]
  );

  const validatedUrl = validatedUrlResult.valid
    ? validatedUrlResult.cleanUrl
    : null;
  const videoId = validatedUrlResult.valid ? validatedUrlResult.videoId : null;

  const value = useMemo(
    () => ({
      currentUrl,
      setCurrentUrl,
      debouncedUrl,
      validatedUrl,
      videoId,
      registerFormSetter,
      selectTrendingRecipe,
      urlSource,
    }),
    [
      currentUrl,
      setCurrentUrl,
      debouncedUrl,
      validatedUrl,
      videoId,
      registerFormSetter,
      selectTrendingRecipe,
      urlSource,
    ]
  );

  return (
    <YoutubeUrlContext.Provider value={value}>
      {children}
    </YoutubeUrlContext.Provider>
  );
};

export const useYoutubeUrl = () => {
  const context = useContext(YoutubeUrlContext);
  if (!context) {
    throw new Error("useYoutubeUrl must be used within YoutubeUrlProvider");
  }
  return context;
};
