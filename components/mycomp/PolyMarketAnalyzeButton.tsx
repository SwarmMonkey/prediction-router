'use client';

import { useState } from 'react';
import { PolymarketEvent} from '@/lib/types'; 

type AnalyzeButtonProps = {
  eventData: PolymarketEvent | null; 
  onAnalysisComplete?: (result: string | null) => void;
  onAnalyzeStart?: () => void;
  hideResult?: boolean;
};

export default function PolyMarketAnalyzeButton({ eventData, onAnalysisComplete, onAnalyzeStart, hideResult = false }: AnalyzeButtonProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    if (onAnalyzeStart) onAnalyzeStart();

    if (!eventData || !eventData.markets || !Array.isArray(eventData.markets) || eventData.markets.length === 0) {
      setError('No market data to analyze');
      setIsLoading(false);
      if (onAnalysisComplete) onAnalysisComplete(null);
      return;
    }

    let analysisPayload;

    if (eventData.markets.length === 1) {
      analysisPayload = { marketData: eventData.markets[0] };
    } else {
      analysisPayload = { eventData: eventData };
    }

    try {
      const response = await fetch('/api/polymarketanalyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API error details:', errorData);
        throw new Error(`Analysis request failed with status ${response.status}: ${errorData?.error || ''}`);
      }

      const result = await response.json();
      console.log('Success response:', result);

      if (result.error) {
        throw new Error(result.error);
      }

      const analysisResult = result.analysis;
      setAnalysis(analysisResult);
      if (onAnalysisComplete) onAnalysisComplete(analysisResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze market. Please try again.';
      setError(errorMessage);
      console.error('Analysis error:', err);
      if (onAnalysisComplete) onAnalysisComplete(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-4">
      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="px-8 py-4 bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-700 disabled:bg-blue-300 shadow-lg transition-all duration-200 flex items-center justify-center min-w-[220px] hover:scale-105"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze Market'
        )}
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {!hideResult && analysis && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
          <p className="whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </div>
  );
}