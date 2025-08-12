import { NextRequest, NextResponse } from 'next/server';
import {  MarketsType} from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, marketData } = body;

    if (!message || !marketData) {
      return NextResponse.json({ error: 'Missing message or market data' }, { status: 400 });
    }

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    let context = '';

    if (Array.isArray(marketData?.markets) && marketData.markets.length > 0) {
      context = `You are a helpful and concise AI assistant discussing a prediction market event on Kalshi. Here is information about the current market(s):\n\n`;
      marketData.markets.forEach((market:MarketsType) => {
        context += `Market: ${market.title || market.event_ticker || market.ticker}\n`;
        context += `Ticker: ${market.ticker}\n`;
        context += `Yes Bid: ${market.yes_bid}, Yes Ask: ${market.yes_ask}\n`;
        context += `No Bid: ${market.no_bid}, No Ask: ${market.no_ask}\n`;
        context += `Rules: ${market.rules_primary}\n\n`;
      });
      context += `The user has asked: "${message}". Respond to the user briefly and conversationally based on this information.`;
    } else if (marketData?.ticker) {
      context = `You are a helpful and concise AI assistant discussing a prediction market on Kalshi. Here is information about the current market:\n\n`;
      context += `Market: ${marketData.title || marketData.ticker || marketData.subtitle}\n`;
      context += `Ticker: ${marketData.ticker}\n`;
      context += `Yes Bid: ${marketData.yes_bid}, Yes Ask: ${marketData.yes_ask}\n`;
      context += `No Bid: ${marketData.no_bid}, No Ask: ${marketData.no_ask}\n`;
      context += `Rules: ${marketData.rules_primary}\n\n`;
      context += `The user has asked: "${message}". Respond to the user briefly and conversationally based on this information.`;
    } else {
      return NextResponse.json({ reply: 'Sorry, I don\'t have enough information to discuss this market.' });
    }

    const payload = {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: `You are a concise and friendly AI assistant that provides brief, conversational responses about Kalshi prediction markets.Avoid long messages think of a normal conversation with two humans.`,
        },
        {
          role: 'user',
          content: context,
        },
      ],
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
        headers: {
          Authorization: `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Perplexity API error:', response.status, await response.text());
        return NextResponse.json({ reply: 'Error communicating with the AI.' }, { status: response.status });
      }

      const data = await response.json();
      const aiReply = data?.choices?.[0]?.message?.content;

      return NextResponse.json({ reply: aiReply });
    } catch (error) {
      console.error('Error in /api/ai-chat:', error);
      return NextResponse.json({ reply: 'Something went wrong on the server.' }, { status: 500 });
    }
  }