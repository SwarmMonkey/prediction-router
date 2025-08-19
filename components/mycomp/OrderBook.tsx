'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderBookData {
  orderbook?: {
    yes: [number, number][];
    no: [number, number][];
  };
}

interface MarketOption {
  value: string;
  label: string;
}

interface OrderBookProps {
  orderBookDataMap: Record<string, OrderBookData | null>;
  markets: {
    ticker: string;
    title: string;
    subtitle: string;
    yes_sub_title: string;
  }[];
}

export default function OrderBook({ orderBookDataMap, markets }: OrderBookProps) {
  const hasMultipleMarkets = markets.length > 1;
  const marketOptions: MarketOption[] = useMemo(() => {
    return markets.map((market) => ({
      value: market.ticker,
        label: (market.subtitle?.replace(/^::\s*/, '') || market.yes_sub_title?.replace(/^::\s*/, '') || market.title || market.ticker),
    }));
  }, [markets]);

  const [selectedTicker, setSelectedTicker] = useState<string | undefined>(marketOptions[0]?.value);

  const currentOrderBookData = selectedTicker ? orderBookDataMap[selectedTicker] : undefined;
  const currentMarketLabel = marketOptions.find(option => option.value === selectedTicker)?.label || (hasMultipleMarkets ? "Select a Market" : markets[0]?.subtitle?.replace(/^::\s*/, '') || markets[0]?.yes_sub_title?.replace(/^::\s*/, '') || markets[0]?.title || markets[0]?.ticker || "Market Order Book");

  // Custom styles to remove hover effects
  const noHoverStyle = {
    transition: 'none',
    boxShadow: 'none',
    transform: 'none',
  };

  if (hasMultipleMarkets && (!currentOrderBookData || !currentOrderBookData.orderbook)) {
    return (
      <div style={noHoverStyle}>
        <Card className="mt-6" style={noHoverStyle}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-gradient bg-clip-text bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600">Market Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                <SelectTrigger className="w-full max-w-sm border border-input/60 rounded-lg">
                  <SelectValue placeholder="Select a Market" />
                </SelectTrigger>
                <SelectContent>
                  {marketOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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

  const orderbook = currentOrderBookData?.orderbook;

  return (
    <div style={noHoverStyle}>
      <Card className="mt-6 mb-4" style={noHoverStyle}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">
            <span className="text-gradient bg-clip-text bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600">
              Order Book
            </span> 
            <span className="ml-2 font-normal text-base">for {currentMarketLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasMultipleMarkets && (
            <div className="mb-5">
              <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                <SelectTrigger className="w-full max-w-sm border border-input/60 rounded-lg">
                  <SelectValue placeholder="Select a Market" />
                </SelectTrigger>
                <SelectContent>
                  {marketOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* YES Side */}
            <div className="backdrop-blur-sm bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm" style={noHoverStyle}>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-medium text-green-800 dark:text-green-300">YES Orders</h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 font-medium text-sm mb-2 pb-2 border-b">
                  <div>Price</div>
                  <div>Quantity</div>
                </div>
                <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                  {orderbook?.yes?.map(([price, quantity], index) => (
                    <div key={`yes-${index}`} className="grid grid-cols-2 gap-2 text-sm py-1.5 border-b last:border-0">
                      <div className="font-medium text-green-600 dark:text-green-400">${price}</div>
                      <div>{quantity.toLocaleString()}</div>
                    </div>
                  ))}
                  {!orderbook?.yes && <div className="text-sm text-gray-500 py-2">No YES orders available.</div>}
                  {orderbook?.yes?.length === 0 && <div className="text-sm text-gray-500 py-2">No YES orders.</div>}
                </div>
              </div>
            </div>

            {/* NO Side */}
            <div className="backdrop-blur-sm bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm" style={noHoverStyle}>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-medium text-red-800 dark:text-red-300">NO Orders</h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 font-medium text-sm mb-2 pb-2 border-b">
                  <div>Price</div>
                  <div>Quantity</div>
                </div>
                <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                  {orderbook?.no?.map(([price, quantity], index) => (
                    <div key={`no-${index}`} className="grid grid-cols-2 gap-2 text-sm py-1.5 border-b last:border-0">
                      <div className="font-medium text-red-600 dark:text-red-400">${price}</div>
                      <div>{quantity.toLocaleString()}</div>
                    </div>
                  ))}
                  {!orderbook?.no && <div className="text-sm text-gray-500 py-2">No NO orders available.</div>}
                  {orderbook?.no?.length === 0 && <div className="text-sm text-gray-500 py-2">No NO orders.</div>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}