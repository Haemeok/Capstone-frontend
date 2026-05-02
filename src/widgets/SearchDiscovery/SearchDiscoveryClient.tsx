"use client";

import SearchDiscoveryDefault from "./SearchDiscoveryDefault";
import SearchDiscoveryFocused from "./SearchDiscoveryFocused";

type SearchDiscoveryClientProps = {
  focused: boolean;
};

const SearchDiscoveryClient = ({ focused }: SearchDiscoveryClientProps) => {
  return focused ? <SearchDiscoveryFocused /> : <SearchDiscoveryDefault />;
};

export default SearchDiscoveryClient;
