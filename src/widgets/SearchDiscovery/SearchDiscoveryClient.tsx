"use client";

import type { ReactNode } from "react";

import SearchDiscoveryDefault from "./SearchDiscoveryDefault";
import SearchDiscoveryFocused from "./SearchDiscoveryFocused";

type SearchDiscoveryClientProps = {
  focused: boolean;
  cookedPopularSlot?: ReactNode;
};

const SearchDiscoveryClient = ({
  focused,
  cookedPopularSlot,
}: SearchDiscoveryClientProps) => {
  return focused ? (
    <SearchDiscoveryFocused />
  ) : (
    <SearchDiscoveryDefault cookedPopularSlot={cookedPopularSlot} />
  );
};

export default SearchDiscoveryClient;
