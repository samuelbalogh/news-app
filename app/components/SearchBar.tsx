import { useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import styled from 'styled-components'

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(148, 163, 184, 0.4);
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.1);
  }
`

interface SearchBarProps {
    onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('')

    const debouncedSearch = useCallback(
        (searchQuery: string) => {
            const debouncedFn = debounce((q: string) => {
                onSearch(q)
            }, 300)
            debouncedFn(searchQuery)
            return debouncedFn.cancel
        },
        [onSearch]
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value
        setQuery(newQuery)
        debouncedSearch(newQuery)
    }

    return (
        <SearchContainer>
            <SearchInput
                type="text"
                placeholder="search articles..."
                value={query}
                onChange={handleSearch}
            />
        </SearchContainer>
    )
} 