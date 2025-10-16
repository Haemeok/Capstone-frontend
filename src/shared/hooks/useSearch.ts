import { useEffect, useState } from "react";

const DEBOUNCE_DELAY_MS = 300;

const useSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(inputValue);
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDebouncedSearchQuery(inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return {
    searchQuery: debouncedSearchQuery,
    inputValue,
    handleSearchSubmit,
    handleInputChange,
    setInputValue,
  };
};

export default useSearch;
