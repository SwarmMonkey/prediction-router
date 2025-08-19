import { FetchEvents } from '@/lib/data';
import EventsDisplay from '@/components/mycomp/EventsDisplay';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PredictionRouter | Prediction Market Aggregator',
  description: 'Make informed decisions with PredictionRouter, a prediction market aggregator. Get real-time insights from Kalshi, Polymarket, and more.',
  keywords: ['prediction markets', 'forecasting', 'AI trading assistant', 'Kalshi', 'Polymarket', 'market insights'],
  openGraph: {
    title: 'PredictionRouter | Prediction Market Aggregator',
    description: 'Make informed decisions with PredictionRouter, a prediction market aggregator. Get real-time insights and analytics.',
    images: [{ url: '/PredictionRouter_logo.png?v=2', width: 1200, height: 630, alt: 'PredictionRouter' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PredictionRouter | Prediction Market Aggregator',
    description: 'Aggregate and analyze trends across Kalshi, Polymarket and more.',
    images: ['/PredictionRouter_logo.png?v=2'],
  },
};

export default async function Page() {
  const eventsResult = await FetchEvents();
  const initialEventsWithMarkets = eventsResult?.events ?? [];

  return (
    <> 
    
    <div className="mx-auto max-w-[1400px]">
    

      <div className="flex flex-col space-y-2.5">
        <div className="mt-4 mb-4 flex flex-row justify-between">
          
        </div>
        <EventsDisplay allEvents={initialEventsWithMarkets} />
      </div>
    </div>
    </>
  );
}
