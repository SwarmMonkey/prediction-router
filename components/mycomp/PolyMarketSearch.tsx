'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface PolymarketSearchBarProps {
  onSearch: (term: string) => void;
}

export default function PolymarketSearchBar({ onSearch }: PolymarketSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchQuery(term);
    onSearch(term); 
  }, [onSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch(''); 
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Polymarket events"
            className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-12 text-gray-800 placeholder-gray-500 shadow-sm transition-all focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-100"
            value={searchQuery}
            onChange={handleInputChange}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
