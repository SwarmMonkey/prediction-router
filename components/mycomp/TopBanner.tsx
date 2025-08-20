'use client';

import { useState } from 'react';

const OFFICIAL_CA = 'xVEzVQf4BkBKJXzaZnUgYkjHqjpEUj2vCmc933fpump';

export default function TopBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800 text-green-900 dark:text-green-50">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-xs sm:text-sm font-medium">Official CA:</span>
          <code
            onClick={handleCopy}
            className={`cursor-pointer select-all text-[11px] sm:text-xs md:text-sm font-mono px-1 sm:px-1.5 py-0.5 rounded bg-white/70 dark:bg-white/10 ${copied ? 'ring-2 ring-green-300 dark:ring-green-700' : ''} text-green-800 dark:text-green-100`}
            title={OFFICIAL_CA}
            role="button"
            tabIndex={0}
          >
            {OFFICIAL_CA}
          </code>
        </div>
        {copied ? (
          <div className="mt-1 text-center text-[11px] sm:text-xs text-green-700 dark:text-green-200">Copied</div>
        ) : null}
      </div>
    </div>
  );
}


