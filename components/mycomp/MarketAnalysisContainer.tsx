'use client';

import { useState } from 'react';
import AnalyzeButton from './AnalyzeButton';
import MarketsComponent from './Markets';
import { MarketsResponse, MarketsType } from '@/lib/types';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

type MarketAnalysisContainerProps = {
  market: MarketsResponse | null;
};

export default function MarketAnalysisContainer({ market }: MarketAnalysisContainerProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFullRules, setShowFullRules] = useState(false);
  const rulesLengthLimit = 200;

  const handleAnalysisResult = (result: string | null) => {
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleStartAnalyzing = () => {
    setIsAnalyzing(true);
  };

  const isSingleMarket = market?.markets?.length === 1;
  const currentMarket: MarketsType | undefined = market?.markets?.[0]; 

  const rulesToShow = isSingleMarket ? currentMarket?.rules_primary : currentMarket?.rules_secondary;
  const hasSecondaryRules = !isSingleMarket && currentMarket?.rules_secondary;

  const shortRules =
    rulesToShow && rulesToShow.length > rulesLengthLimit
      ? rulesToShow.slice(0, rulesLengthLimit) + '...'
      : rulesToShow;

  return (
    <div className="mb-6">
      <div className="flex justify-center mb-6">
        <AnalyzeButton
          market={market}
          onAnalysisComplete={handleAnalysisResult}
          onAnalyzeStart={handleStartAnalyzing}
          hideResult={true}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className={`flex-1 ${isSingleMarket ? 'max-w-xl' : ''}`}>
          {currentMarket && rulesToShow && (
            <div className="my-6 mx-2 rounded-md border border-gray-300 bg-gray-50 p-6 shadow-sm">
              <h4 className="font-semibold mb-3">Market Rules</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {showFullRules ? rulesToShow : shortRules}
              </p>
              {rulesToShow.length > rulesLengthLimit && (
                <button
                  className="text-blue-500 hover:underline mt-2 flex items-center"
                  onClick={() => setShowFullRules(!showFullRules)}
                >
                  {showFullRules ? (
                    <>
                      Show less <ChevronUpIcon className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </>
                  )}
                </button>
              )}
              {hasSecondaryRules && isSingleMarket && currentMarket.rules_secondary && (
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-semibold">Secondary Rule:</span> {currentMarket.rules_secondary}
                </div>
              )}
            </div>
          )}
          <MarketsComponent marketData={market} />
        </div>

        <div className="flex-1">
          {isAnalyzing && !analysis && (
            <div className="bg-white rounded-md overflow-hidden p-5 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-white rounded-md overflow-hidden p-5 border border-gray-200">
              <h3 className="font-semibold text-lg mb-3 text-blue-600">Market Analysis</h3>
              <div className="whitespace-pre-wrap text-gray-700 prose prose-sm">{analysis}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}