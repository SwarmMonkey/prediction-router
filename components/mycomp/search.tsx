'use client';
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { EventsType, MarketsType } from '@/lib/types';
import { useRouter } from 'next/navigation';

export type EventsWithMarkets = EventsType & {
  markets: MarketsType[];
};

interface SearchBarProps {
  allEvents: EventsWithMarkets[];
  onSearch: (term: string) => void; 
}

export default function SearchBar({ allEvents, onSearch }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      onSearch(searchQuery); 
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, onSearch]);

  const filteredEvents = debouncedQuery
    ? allEvents.filter((event) =>
        event.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : allEvents.slice(0, 5);
  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch(""); 
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEventClick = (eventTicker: string) => {
    setIsOpen(false);
    setSearchQuery("");
    onSearch(""); 
    router.push(`/markets/${eventTicker}`);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Kalshi events"
            className="h-14 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-12 text-gray-800 placeholder-gray-500 shadow-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            onFocus={handleFocus}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {isOpen && (
        <div className="absolute mt-2 w-full rounded-xl border border-gray-200 bg-white py-3 shadow-lg z-10">
          <div className="px-3 py-1 max-h-60 overflow-y-auto scrollbar-thin">
            {filteredEvents.length > 0 ? (
              <>
                {filteredEvents.map((event) => (
                  <div
                    key={event.event_ticker}
                    className="flex items-start rounded-xl p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleEventClick(event.event_ticker)}
                  >
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-800">
                        {event.title}
                      </p>
                      {event.category && (
                        <p className="text-xs text-gray-500">
                          {event.category}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No events found for &quot;{debouncedQuery}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
