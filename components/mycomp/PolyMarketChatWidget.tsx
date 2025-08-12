'use client';

import React, { useState } from 'react';
import { PolymarketEvent } from '@/lib/types';
import { X, Sparkles } from 'lucide-react';
import PolyMarketAIChat from './PolymarketAIChat';

interface PolymarketChatWidgetProps {
  eventData: PolymarketEvent | null;
}

export default function PolymarketChatWidget({ eventData }: PolymarketChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
            aria-label="Open chat"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-16 right-4 w-[360px] h-[520px] bg-white rounded-xl shadow-xl border border-gray-300 z-50 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-2 bg-purple-600 text-white rounded-t-xl">
            <span className="font-semibold">AI Chat</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200 transition"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <PolyMarketAIChat marketData={eventData} apiEndpoint="/api/poly-ai-chat" /> 
          </div>
        </div>
      )}
    </>
  );
}