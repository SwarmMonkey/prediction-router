import PolyMarketAnalysis from "@/components/mycomp/PolyMarketAnalysis";
import { OrderBookResponse} from "@/lib/types";

import { GetMarketOrderBooks, GetPolymarketEvent } from "@/lib/data"
import PolyMarketOrderBook from "@/components/mycomp/PolyMarketOrderBook";
import PolymarketChatWidget from "@/components/mycomp/PolyMarketChatWidget";
import { Metadata } from "next";

interface MarketOrderBooks {
  [clobTokenId: string]: OrderBookResponse | null;
}

interface EventOrderBookData {
  [conditionId: string]: MarketOrderBooks;
}

type ParamsType = Promise<{ id: string }>;

// Generate dynamic metadata for each Polymarket page
export async function generateMetadata({ params }: { params: ParamsType }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const eventData = await GetPolymarketEvent(id);
    
    if (eventData) {
      const title = eventData.title || 'Polymarket Event';
      
      return {
        title: `${title} | Polymarket Analysis`,
        description: `AI-powered analysis for the "${title}" Polymarket prediction event. Get market insights, probability estimates, and trading signals.`,
        keywords: ['Polymarket', 'prediction markets', 'blockchain forecasting', title.toLowerCase(), 'crypto prediction'],
        openGraph: {
          title: `${title} | PredictionRouter Polymarket Analysis`,
          description: `AI-analyzed Polymarket prediction event: ${title}. Get order book data and market insights.`,
          images: [{ url: '/prediction.png', width: 1200, height: 630, alt: `${title} Polymarket Analysis` }],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${title} | PredictionRouter`,
          description: `AI analysis for Polymarket prediction event: ${title}`,
          images: ['/prediction.png'],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  // Fallback metadata
  return {
    title: 'Polymarket Event | PredictionRouter',
    description: 'Detailed AI-powered analysis for Polymarket prediction events.',
  };
}

export default async function EventDetails({ params }: { params: ParamsType }) {
  const { id } = await params;
  try {
    const eventData = await GetPolymarketEvent(id);

    if (eventData?.markets && eventData.markets.length > 0) {
      const eventOrderBookData: EventOrderBookData = {};

      for (const market of eventData.markets) {
       
        if (market.closed) {
          // console.warn(
          //   `Market ${market.conditionId} is inactive or closed, skipping order book fetch.`
          // );
          eventOrderBookData[market.conditionId] = {};
          continue;
        }

        try {
          const clobTokenIds = JSON.parse(market.clobTokenIds || "[]") as string[];
          const marketOrderBooks = await GetMarketOrderBooks(clobTokenIds);
          eventOrderBookData[market.conditionId] = marketOrderBooks;
        } catch (error) {
          console.error(`Error fetching order books for market ${market.conditionId}:`, error);
          eventOrderBookData[market.conditionId] = {}; 
        }
      }

      return (
        <div className="mx-auto max-w-[1400px] px-4">
          <h1 className="font-bold text-2xl max-w-lg mt-10 mb-2.5">
            {eventData.title}
          </h1>

          {eventData && <PolyMarketAnalysis eventData={eventData} />}

          {eventData.markets && (
            <PolyMarketOrderBook orderBookData={eventOrderBookData} markets={eventData.markets} />
          )}
          {eventData && <PolymarketChatWidget eventData={eventData}/>}
        </div>
      );
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
    return <div>Error loading event data.</div>;
  }

  return <div>Loading event details...</div>;
}


