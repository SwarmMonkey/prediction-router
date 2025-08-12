import { PolymarketEvent } from "./types";


interface OrderBookResponse {
  market: string; 
  asset_id: string;
  hash: string;
  timestamp: string;
  bids: { price: string; size: string }[];
  asks: { price: string; size: string }[];
}
interface MarketOrderBooks {
  [clobTokenId: string]: OrderBookResponse | null;
}

export async function FetchEvents() {
  const url = `https://api.elections.kalshi.com/trade-api/v2/events?status=open&with_nested_markets=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('failed to fetch events:', error);
    return null;
  }
}

export async function FetchEventsFromPolyMarket(){

  const url = `https://gamma-api.polymarket.com/events?archived=false&closed=false`

  try {
    const res = await fetch(url)
    if(!res.ok){
      console.error(`HTTP error: ${res.status}`)
      return null
    }

    const data = await res.json()
    return data
    
  } catch (error) {
    console.error('failed to fetch events:', error)
    return null
    
  }
}

export async function fetchAndFilterActiveMarkets() {
  const apiUrl = "https://gamma-api.polymarket.com/events?archived=false&closed=false";
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const events:PolymarketEvent[] = await response.json();

    const eventsWithActiveMarkets = events.map(event => {
      
      const activeMarkets = event.markets.filter(market => market.active === true && market.closed === false);
      
      return {
        ...event,
        markets: activeMarkets
      };
    })

   
    return eventsWithActiveMarkets;

  } catch (error) {
    console.error("Error fetching or filtering data:", error);
  }
}




export async function FetchMarkets(event_ticker:string){

   const url = `https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=${event_ticker}`

   try {

      const res = await fetch(url)
      if(!res.ok){
         throw new Error('http error')
      }
      const data = await res.json()
      return data
      
   } catch (error) {
      console.error('failed to fetch Markets:', error);
    return null;
      
   }
}


export async function GetMarket(ticker:string){

  const url = ` https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}`

    try {

      const res = await fetch(url)
      if(!res.ok){
         throw new Error('http error')
      }
      const data = await res.json()
      return data
      
   } catch (error) {
      console.error('failed to fetch Markets:', error);
    return null;
      
   }
}

export async function GetPolymarketEvent(eventid:string){

  const url = `https://gamma-api.polymarket.com/events/${eventid}`

  try {

    const res = await fetch(url)
    if(!res.ok){
      throw new Error('http error')
    }
    const data = await res.json()
    return data
    
  } catch (error) {
    console.error('failed to display markets', error)
    
  }
}

export async function GetMarketOrderBook(ticker:string){

  const url = ` https://api.elections.kalshi.com/trade-api/v2/markets/${ticker}/orderbook`

  try {

    const res = await fetch(url)
    if(!res.ok){
      throw new Error('http error')
    }
    const data = await res.json()
    return data
    
  } catch (error) {
    console.error('failed to fetch market orders ', error)
    return null    
  }
}


export async function GetPolyMarketOrderBook(tokenId:string){

  const url = `https://clob.polymarket.com/book?token_id=${tokenId}`
  try {
    const response = await fetch(url)
    if(!response.ok){
      console.error(`CLOB API error fetching order book for ${tokenId}`)
      return null
    }
    const data = await response.json()
    return data as OrderBookResponse
    

  } catch (error) {
    console.error('Error fetching order book', error)
    return null
    
  }
}

export async function GetMarketOrderBooks(clobTokenIds: string[]){
  const orderBooks: MarketOrderBooks = {};
  const promises = clobTokenIds.map(async (tokenId) => {
    const orderBook = await GetPolyMarketOrderBook(tokenId);
    orderBooks[tokenId] = orderBook;
  });
  await Promise.all(promises);
  return orderBooks;
}
