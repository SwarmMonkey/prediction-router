'use client'

import { useState } from "react";
import { PolymarketMarket } from "@/lib/types";



const calculateProbability = (price: string | undefined | null): number | null => {
  if (price !== null && price !== undefined && !isNaN(parseFloat(price))) {
    return parseFloat(price) * 100;
  }
  return null;
};
interface PolyMarketDisplayProps {
  markets: PolymarketMarket[];
}



export default function PolyMarketDisplay({markets}:PolyMarketDisplayProps) {
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const displayedMarkets = showAllMarkets ? markets : markets.slice(0, 5);

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      {markets.length === 1 ? (
        <SingleMarket market={markets[0]} calculateProbability={calculateProbability} />
      ) : (
        displayedMarkets.map((market) => (
          <MultipleMarketItem key={market.id} market={market} calculateProbability={calculateProbability} />
        ))
      )}
      {markets.length > 5 && (
        <div className="p-4 flex justify-center">
          <button className="text-gray-700 font-medium" onClick={() => setShowAllMarkets(!showAllMarkets)}>
            {showAllMarkets ? "Show Less" : "Show More Markets"}
          </button>
        </div>
      )}
    </div>
  );
}

interface SingleMarketProps {
  market: PolymarketMarket;
  calculateProbability: (price: string | undefined | null) => number | null;
}

function SingleMarket({ market, calculateProbability }: SingleMarketProps) {
  let outcomePrices: string[] = [];
  try {
    outcomePrices = typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : (market.outcomePrices || []);
  } catch (e) {
    console.error("Error parsing outcomePrices:", e);
  }
  const yesProbability = calculateProbability(outcomePrices[0]);
  const noProbability = calculateProbability(outcomePrices[1]);
  const isClose5050 =
    yesProbability !== null && yesProbability >= 40 && yesProbability <= 60;

  return (
    <div className="p-4">
      <h3 className="font-medium">{market.question}</h3>
      <div className="mt-4 h-6 w-full bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full ${
            isClose5050 ? 'bg-gradient-to-r from-red-400 to-green-400' : 'bg-green-400'
          }`}
          style={{ width: `${yesProbability !== null ? yesProbability : 50}%` }}
        ></div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-gray-700">Yes</p>
          <span className="text-xl text-green-600 font-bold">
            {yesProbability !== null ? `${yesProbability.toFixed(1)}%` : 'N/A'}
          </span>
        </div>
        {noProbability !== null && (
          <div className="text-right">
            <p className="text-gray-700">No</p>
            <span className="text-xl text-red-600 font-bold">
              {noProbability !== null ? `${noProbability.toFixed(1)}%` : 'N/A'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface MultipleMarketItemProps {
  market: PolymarketMarket;
  calculateProbability: (price: string | undefined | null) => number | null;
}



function MultipleMarketItem({ market, calculateProbability }:MultipleMarketItemProps) {
  let outcomePrices: string[] = [];
  try {
    outcomePrices = typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : (market.outcomePrices || []);
  } catch (e) {
    console.error("Error parsing outcomePrices:", e);
  }
  const yesProbability = calculateProbability(outcomePrices[0]);
  const isClose5050 =
    yesProbability !== null && yesProbability >= 40 && yesProbability <= 60;

  return (
    <div key={market.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-medium">{market.question}</h3>
        </div>
        {yesProbability !== null && (
          <div>
            <span
              className={`text-xl font-bold ${
                isClose5050 ? 'text-purple-500' : 'text-green-400'
              }`}
            >
              {yesProbability !== null ? `${yesProbability.toFixed(1)}%` : 'N/A'}
            </span>
          </div>
        )}
      </div>
      {yesProbability !== null && (
        <div className="h-4 w-full bg-gray-200 rounded-full mt-2">
          <div
            className={`h-full rounded-full ${
              isClose5050 ? 'bg-gradient-to-r from-red-400 to-green-400' : 'bg-green-400'
            }`}
            style={{ width: `${yesProbability}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}