'use client'

import { useState } from "react";
import { MarketsResponse } from "@/lib/types";

interface MarketsComponentProps {
  marketData: MarketsResponse | null;
}

export default function MarketsComponent({ marketData }: MarketsComponentProps) {
  const [showAllMarkets, setShowAllMarkets] = useState(false);

  if (!marketData || !marketData.markets) {
    return <div>Loading Markets...</div>;
  }

  const mainMarkets = marketData.markets;

  const calculateProbability = (
    yesBid: number,
    yesAsk: number,
    noBid?: number,
    noAsk?: number
  ): { yes: string; yes_value: number; no?: string; no_value?: number } => {
    const yesValue = yesBid !== undefined && yesAsk !== undefined
      ? (yesBid + yesAsk) / 2
      : 0;
    
    const noValue = noBid !== undefined && noAsk !== undefined
      ? (noBid + noAsk) / 2
      : undefined;
    
    return { 
      yes: `${yesValue.toFixed(1)}%`,
      yes_value: yesValue,
      no: noValue !== undefined ? `${noValue.toFixed(1)}%` : undefined,
      no_value: noValue
    };
  };

  // Logic for single Yes/No market display
  if (mainMarkets.length === 1) {
    const market = mainMarkets[0];
    const probabilities = calculateProbability(market.yes_bid, market.yes_ask, market.no_bid, market.no_ask);
    const isClose5050 = probabilities.yes_value && probabilities.yes_value >= 40 && probabilities.yes_value <= 60;
    
    return (
      <div className="bg-white rounded-md shadow-md overflow-hidden p-4">
        <h3 className="font-medium">{market.title}</h3>
        
        {/* Probability Bar for visual representation */}
        <div className="mt-4 h-6 w-full bg-gray-200 rounded-full">
          <div 
            className={`h-full rounded-full ${isClose5050 ? 'bg-gradient-to-r from-red-400 to-green-400' : 'bg-green-400'}`}
            style={{ width: `${probabilities.yes_value}%` }}
          ></div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-gray-700">Yes</p>
            <span className="text-xl text-green-600 font-bold">{probabilities.yes}</span>
          </div>
          {probabilities.no && (
            <div className="text-right">
              <p className="text-gray-700">No</p>
              <span className="text-xl text-red-600 font-bold">{probabilities.no}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Logic for multiple markets display
  const displayedMarkets = showAllMarkets ? mainMarkets : mainMarkets.slice(0, 5);

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      {displayedMarkets.map((market) => {
        const probabilities = calculateProbability(market.yes_bid, market.yes_ask, market.no_bid, market.no_ask);
        const isClose5050 = probabilities.yes_value >= 40 && probabilities.yes_value <= 60;
        
        return (
          <div key={market.ticker} className="p-4 border-b hover:bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium">{market.yes_sub_title || market.title}</h3>
                <p className="text-gray-500 text-sm">
                  {market.subtitle.replace(/^::\s*/, '')}
                </p>
              </div>
              <div>
                <span className={`text-xl font-bold ${isClose5050 ? 'text-purple-500' : 'text-green-400'}`}>
                  {probabilities.yes}
                </span>
              </div>
            </div>
            
            {/* Add probability bar for each market */}
            <div className="h-4 w-full bg-gray-200 rounded-full mt-2">
              <div 
                className={`h-full rounded-full ${isClose5050 ? 'bg-gradient-to-r from-red-400 to-green-400' : 'bg-green-400'}`}
                style={{ width: `${probabilities.yes_value}%` }}
              ></div>
            </div>
          </div>
        );
      })}

      {mainMarkets.length > 5 && (
        <div className="p-4 flex justify-center">
          <button className="text-gray-700 font-medium" onClick={() => setShowAllMarkets(!showAllMarkets)}>
            {showAllMarkets ? "Show Less" : "Show More Markets"}
          </button>
        </div>
      )}
    </div>
  );
}