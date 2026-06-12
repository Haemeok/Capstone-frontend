"use client";

import { createContext, useContext } from "react";

import type { Dictionary } from "./types";

const DictionaryContext = createContext<Dictionary | null>(null);

export const DictionaryProvider = ({
  dict,
  children,
}: {
  dict: Dictionary;
  children: React.ReactNode;
}) => (
  <DictionaryContext.Provider value={dict}>
    {children}
  </DictionaryContext.Provider>
);

export const useT = (): Dictionary => {
  const dict = useContext(DictionaryContext);
  if (!dict) {
    throw new Error("useT must be used within a DictionaryProvider");
  }
  return dict;
};
