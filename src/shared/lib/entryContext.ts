"use client";

const entryPath =
  typeof window === "undefined" ? null : window.location.pathname;

let internalNav = false;

export const markInternalNav = (pathname: string): void => {
  if (entryPath !== null && pathname !== entryPath) internalNav = true;
};

export const isEntryPath = (pathname: string): boolean =>
  entryPath !== null && pathname === entryPath;

export const hasInternalNav = (): boolean => internalNav;
