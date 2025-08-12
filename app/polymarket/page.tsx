import EventsDisplayPolyMarket from '@/components/mycomp/EventsDisplayPolyMarket';
import { fetchAndFilterActiveMarkets } from '@/lib/data';
import { PolymarketEvent } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polymarket Events | PredictionRouter',
  description: 'Explore active Polymarket prediction events with AI-powered analysis. Get insights, forecasts and trading opportunities.',
  keywords: ['Polymarket', 'crypto prediction markets', 'blockchain forecasting', 'prediction market analysis'],
  openGraph: {
    title: 'Polymarket Events | PredictionRouter Analysis',
    description: 'Discover Polymarket prediction events with AI-powered analysis to help your forecasting decisions.',
    images: [{ url: '/prediction.png', width: 1200, height: 630, alt: 'Polymarket Events' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polymarket Events | PredictionRouter',
    description: 'AI-analyzed Polymarket prediction events to improve your trading decisions.',
    images: ['/prediction.png'],
  },
};

export default async function Page() {
  const initialEvents = await fetchAndFilterActiveMarkets() as PolymarketEvent[];

  return (
    <>
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col space-y-2.5">
          <div className="mt-6 mb-4 flex flex-row justify-between">
            {/* Empty div for consistent spacing */}
          </div>
          <EventsDisplayPolyMarket allEvents={initialEvents} />
        </div>
      </div>
    </>
  );
}