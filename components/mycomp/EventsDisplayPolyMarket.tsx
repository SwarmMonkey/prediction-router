'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PolymarketEvent } from '@/lib/types';
import PolymarketSearchBar from './PolyMarketSearch';

const categoryMappings: { [key: string]: string } = {
  'Politics': 'politics',
  'Sports': 'sports',
  'Culture': 'culture',
  'Crypto': 'crypto',
  'Climate': 'climate',
  'Economics': 'economics',
  'Companies': 'companies',
  'Financials': 'financials',
  'Tech & Science': 'tech',
  'Health': 'health',
  'World': 'world'
};

const appCategories = ['All', ...Object.keys(categoryMappings)];

interface EventsDisplayProps {
  allEvents: PolymarketEvent[];
}

export default function EventsDisplayPolyMarket({ allEvents }: EventsDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState(''); 
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredByCategory =
    selectedCategory === 'All'
      ? allEvents
      : allEvents.filter(event =>
          event.tags?.some(tag =>
            tag.label.toLowerCase() === categoryMappings[selectedCategory]?.toLowerCase()
          )
        );

  const filteredEvents = filteredByCategory.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateProbability = (price: string | undefined | null): string => {
    if (price !== null && price !== undefined && !isNaN(parseFloat(price))) {
      return `${Math.round(parseFloat(price) * 100)}%`;
    }
    return 'N/A';
  };

  const getCategoryLabel = (event: PolymarketEvent): string | undefined => {
    return event.tags && event.tags.length > 0 ? event.tags[0].label : undefined;
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="px-4">
        <PolymarketSearchBar onSearch={handleSearch} /> 
      </div>

      <div className="overflow-x-auto px-4">
        <div className="flex space-x-4 min-w-max pb-2 justify-center">
          {appCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 text-sm px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-6 md:justify-start md:pl-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(eventData => (
            <Card
              className="w-[380px] h-[220px] md:w-[420px] relative group"
              key={eventData.id}
            >
              <Link href={`/polymarketmarkets/${eventData.id}`} className="absolute inset-0">
                <CardHeader>
                  <div className=" inline-flex items-center mt-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {getCategoryLabel(eventData)}
                  </div>
                  <CardTitle className=" pt-2 text-lg mb-2 line-clamp-2">{eventData.title}</CardTitle>
                </CardHeader>

                {eventData.markets && eventData.markets.length === 1 && (
                  <CardContent className=" flex flex-col space-y-4">
                    {eventData.markets.map(market => {
                      let outcomePrices: string[] = [];
                      try {
                        outcomePrices = typeof market.outcomePrices === 'string'
                          ? JSON.parse(market.outcomePrices)
                          : market.outcomePrices;
                      } catch (e:unknown) {
                        console.error('error',e)
                        outcomePrices = [];
                      }

                      const yesProb = calculateProbability(outcomePrices[0]);
                      const noProb = calculateProbability(outcomePrices[1]);

                      return (
                        <div
                          key={market.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-14 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg">
                              <span className="font-medium text-green-600 dark:text-green-400">Yes</span>
                            </div>
                            <span className="font-semibold text-lg">
                              {yesProb}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-lg">
                              {noProb}
                            </span>
                            <div className="flex items-center justify-center w-14 h-8 bg-red-50 dark:bg-red-900/30 rounded-lg">
                              <span className="font-medium text-red-600 dark:text-red-400">No</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                )}

                {eventData.markets && eventData.markets.length > 1 && (
                  <CardContent className="flex flex-col space-y-3">
                    {eventData.markets.slice(0, 2).map(market => {
                      let outcomePrices: string[] = [];
                      try {
                        outcomePrices = typeof market.outcomePrices === 'string'
                          ? JSON.parse(market.outcomePrices)
                          : market.outcomePrices;
                      } catch (e:unknown) {
                        console.error('Error parsing', e)
                        outcomePrices = [];
                      }

                      const prob = calculateProbability(outcomePrices[0]);

                      return (
                        <div
                          key={market.id}
                          className="flex items-center justify-between"
                        >
                          <div className="text-sm line-clamp-1 max-w-[75%]">{market.question}</div>
                          <div className="flex items-center justify-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{prob}</span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full mt-5">
            No results for &quot;{selectedCategory}{searchTerm && ` matching "${searchTerm}"`}&quot;
          </p>
        )}
      </div>
    </div>
  );
}