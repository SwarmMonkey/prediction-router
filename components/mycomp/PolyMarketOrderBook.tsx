'use client';

import { useState } from 'react';
import { PolymarketMarket } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderBookResponse {
  market: string;
  asset_id: string;
  hash: string;
  timestamp: string;
  bids: { price: string; size: string }[];
  asks: { price: string; size: string }[];
}

interface MarketOrderBooks {
  [clobTokenId: string]: OrderBookResponse | null;
}

interface EventOrderBookData {
  [conditionId: string]: MarketOrderBooks;
}

interface OrderBookComponentProps {
  orderBookData: EventOrderBookData;
  markets: PolymarketMarket[];
}

export default function PolyMarketOrderBook({ orderBookData, markets }: OrderBookComponentProps) {
  const hasMultipleMarkets = markets.length > 1;
  const [selectedConditionId, setSelectedConditionId] = useState<string | undefined>(markets[0]?.conditionId);

  const currentMarketOrderBooks = selectedConditionId ? orderBookData[selectedConditionId] : {};
  const currentMarket = markets.find(market => market.conditionId === selectedConditionId);
  const currentMarketLabel = currentMarket?.question || (hasMultipleMarkets ? "Select a Market" : markets[0]?.question || "Market Order Book");
  const clobTokenIds = currentMarket?.clobTokenIds ? JSON.parse(currentMarket.clobTokenIds) as string[] : [];

  const noHoverStyle = {
    transition: 'none',
    boxShadow: 'none',
    transform: 'none',
  };

  if (hasMultipleMarkets && (!currentMarketOrderBooks || Object.keys(currentMarketOrderBooks).length === 0)) {
    return (
      <div style={noHoverStyle}>
        <Card className="mt-6" style={noHoverStyle}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-gradient bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">Market Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={selectedConditionId} onValueChange={setSelectedConditionId}>
                <SelectTrigger className="w-full max-w-sm border border-input/60 rounded-lg">
                  <SelectValue placeholder="Select a Market" />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((market) => (
                    <SelectItem key={market.conditionId} value={market.conditionId}>
                      {market.question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-8 text-center text-muted-foreground bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              Order Book data not available for the selected market.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={noHoverStyle}>
      <Card className="mt-6 mb-4" style={noHoverStyle}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">
            <span className="text-gradient bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
              Order Book
            </span>
            <span className="ml-2 font-normal text-base">for {currentMarketLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasMultipleMarkets && (
            <div className="mb-5">
              <Select value={selectedConditionId} onValueChange={setSelectedConditionId}>
                <SelectTrigger className="w-full max-w-sm border border-input/60 rounded-lg">
                  <SelectValue placeholder="Select a Market" />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((market) => (
                    <SelectItem key={market.conditionId} value={market.conditionId}>
                      {market.question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clobTokenIds.map((tokenId, index) => {
              const orderbook = currentMarketOrderBooks?.[tokenId];
              const outcome = currentMarket?.outcomes ? JSON.parse(currentMarket.outcomes)[index] : `Outcome ${index + 1}`;
              const colorClass = outcome?.toLowerCase() === 'yes' ? 'text-green-600 dark:text-green-400' : (outcome?.toLowerCase() === 'no' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400');
              const bgClass = outcome?.toLowerCase() === 'yes' ? 'bg-green-50 dark:bg-green-900/20' : (outcome?.toLowerCase() === 'no' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20');

              return (
                <div key={tokenId} className={`backdrop-blur-sm bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm`} style={noHoverStyle}>
                  <div className={`${bgClass} p-3 border-b border-gray-100 dark:border-gray-800`}>
                    <h3 className={`font-medium ${colorClass}`}>{outcome} Orders</h3>
                  </div>
                  <div className="p-3 grid grid-cols-1 gap-4">
                  
                    <div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Bids</h4>
                      <div className="grid grid-cols-2 gap-2 font-medium text-sm mb-2 pb-2 border-b">
                        <div>Price</div>
                        <div>Size</div>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                        {orderbook?.bids?.map((bid, i) => (
                          <div key={`bid-${tokenId}-${i}`} className="grid grid-cols-2 gap-2 text-sm py-1.5 border-b last:border-0">
                            <div className="font-medium text-green-600 dark:text-green-400">${bid.price}</div>
                            <div>{bid.size.toLocaleString()}</div>
                          </div>
                        ))}
                        {!orderbook?.bids && <div className="text-sm text-gray-500 py-2">No bids available.</div>}
                        {orderbook?.bids?.length === 0 && <div className="text-sm text-gray-500 py-2">No bids.</div>}
                      </div>
                    </div>

                    
                    <div>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Asks</h4>
                      <div className="grid grid-cols-2 gap-2 font-medium text-sm mb-2 pb-2 border-b">
                        <div>Price</div>
                        <div>Size</div>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                        {orderbook?.asks?.map((ask, i) => (
                          <div key={`ask-${tokenId}-${i}`} className="grid grid-cols-2 gap-2 text-sm py-1.5 border-b last:border-0">
                            <div className="font-medium text-red-600 dark:text-red-400">${ask.price}</div>
                            <div>{ask.size.toLocaleString()}</div>
                          </div>
                        ))}
                        {!orderbook?.asks && <div className="text-sm text-gray-500 py-2">No asks available.</div>}
                        {orderbook?.asks?.length === 0 && <div className="text-sm text-gray-500 py-2">No asks.</div>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
