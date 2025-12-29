import { Search } from 'lucide-react';
import React from 'react';

import { ARIA_LABELS, DEFAULT_SEARCH_PLACEHOLDER, ICON_SIZE } from '../constants';
import * as S from '../styles';
import type { SearchBarProps } from '../types';

/**
 * Поисковая строка
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = DEFAULT_SEARCH_PLACEHOLDER,
  onChange,
  onSubmit,
}) => {
  const [value, setValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <S.SearchWrapper>
      <form onSubmit={handleSubmit}>
        <S.SearchInput
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          aria-label={ARIA_LABELS.search}
        />
        <S.SearchIcon>
          <Search size={ICON_SIZE - 4} />
        </S.SearchIcon>
      </form>
    </S.SearchWrapper>
  );
};