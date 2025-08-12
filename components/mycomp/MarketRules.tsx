'use client';

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface MarketRulesProps {
  description: string;
}

export default function MarketRules({ description }: MarketRulesProps) {
  const descriptionLengthLimit = 200;
  const shortDescription = description.length > descriptionLengthLimit 
    ? description.slice(0, descriptionLengthLimit) + '...' 
    : description;
  
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  return (
    <div className="my-4 rounded-md border border-gray-300 p-4">
      <h4 className="font-semibold mb-2">Market Rules</h4>
      <p className="text-gray-700 whitespace-pre-line">
        {showFullDescription ? description : shortDescription}
      </p>
      {description.length > descriptionLengthLimit && (
        <button
          className="text-blue-500 hover:underline mt-2 flex items-center"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? (
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
    </div>
  );
} 