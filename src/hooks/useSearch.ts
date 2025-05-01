import { useState } from 'react';

const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return {
    searchQuery,
    inputValue,
    handleSearchSubmit,
    handleInputChange,
    setInputValue,
  };
};

export default useSearch;
