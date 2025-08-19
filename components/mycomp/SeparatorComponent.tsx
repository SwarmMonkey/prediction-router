'use client';

import Link from 'next/link';
import { Separator } from '../ui/separator';
import { usePathname } from 'next/navigation';

export default function SeparatorComponent() {
  const pathname = usePathname();
  const baseLinkClasses = "px-4 py-2 rounded-full text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-green-600 text-white shadow";
  const inactiveLinkClasses = "text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20";

  return (
    <div className="py-3">
      <div className="flex justify-center items-center space-x-4">
        <Link
          className={`${baseLinkClasses} ${pathname === '/app' ? activeLinkClasses : inactiveLinkClasses}`}
          href="/app"
        >
          Kalshi Markets
        </Link>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <Link
          className={`${baseLinkClasses} ${pathname === '/polymarket' ? activeLinkClasses : inactiveLinkClasses}`}
          href="/polymarket"
        >
          PolyMarket Markets
        </Link>
      </div>
      <Separator className="mt-3 dark:bg-gray-700" />
    </div>
  );
}