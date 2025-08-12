import { FetchMarkets, GetMarketOrderBook } from "@/lib/data";
import MarketAnalysisContainer from "@/components/mycomp/MarketAnalysisContainer";
import OrderBook from "@/components/mycomp/OrderBook";
import { MarketsType } from "@/lib/types";
import ChatWidget from "@/components/mycomp/ChatWidget";
import { Metadata } from "next";

interface OrderBookData {
  orderbook?: {
    yes: [number, number][];
    no: [number, number][];
  };
}

type Params = Promise<{ id: string }>;

// Generate dynamic metadata for each market page
export async function generateMetadata({
  params
}: {
  params: Params
}): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const marketsData = await FetchMarkets(id);
    
    if (marketsData?.markets && marketsData.markets.length > 0) {
      const market = marketsData.markets[0];
      const title = market.title || 'Market Analysis';
      const description = market.subtitle || `Detailed analysis and insights for ${title} prediction market`;
      
      return {
        title: `${title} | PredictionRouter Market Analysis` ,
        description: `${description}. Get AI-powered insights, order book data, and forecasting analysis.`,
        keywords: ['prediction market', market.ticker, 'market analysis', 'forecasting', title.toLowerCase()],
        openGraph: {
          title: `${title} | PredictionRouter Market Analysis`,
          description,
          images: [{ url: '/prediction.png', width: 1200, height: 630, alt: `${title} Market Analysis` }],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${title} | PredictionRouter`,
          description,
          images: ['/prediction.png'],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  // Fallback metadata
  return {
    title: 'Market Analysis | PredictionRouter',
    description: 'Detailed prediction market analysis and insights powered by AI.',
  };
}

export default async function Page({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  try {
    const marketsData = await FetchMarkets(id);

    if (marketsData?.markets && marketsData.markets.length > 0) {

      const orderBookPromises = marketsData.markets.map(async (market:MarketsType)=>({
        ticker:market.ticker,
        data: await GetMarketOrderBook(market.ticker)
      }))

      const orderBookResults = await Promise.all(orderBookPromises)
      const orderBookDataMap:Record<string, OrderBookData|null> = {}
      const marketOptions: { value: string; label: string }[] = [];

      marketsData.markets.forEach((market:MarketsType, index:number) => {
        orderBookDataMap[market.ticker] = orderBookResults[index].data;
        marketOptions.push({ value: market.ticker, label: market.title || market.subtitle || market.ticker });
      });

      return (
        <>
        <div className="mx-auto max-w-[1400px] px-4">
          <h1 className="font-bold text-2xl max-w-lg mt-10 mb-2.5">
            {marketsData.markets[0].title}
          </h1>

          <MarketAnalysisContainer market={marketsData} />

          <OrderBook
            orderBookDataMap={orderBookDataMap}
            markets={marketsData.markets}
          />
          
        </div>
        <ChatWidget marketData={marketsData}/>
        </>
      );
    } 
  } catch (error) {
    console.error("Error fetching market data:", error);
    return <div>Error loading market data.</div>;
  }
}
