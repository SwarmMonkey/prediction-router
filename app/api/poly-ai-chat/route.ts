import { NextRequest, NextResponse } from 'next/server';
import { PolymarketMarket } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, eventData } = body;

    if (!message || !eventData) {
      return NextResponse.json({ error: 'Missing message or event data' }, { status: 400 });
    }

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    let context = '';

    if (eventData?.markets && eventData.markets.length > 0) {
      context = `You are a helpful and concise AI assistant discussing a prediction market event on Polymarket. Here is information about the current market(s):\n\n`;
      eventData.markets.forEach((market: PolymarketMarket) => {
        const yesPrice = parseFloat(market.outcomePrices?.split(',')[0]?.replace('[', '') || '0');
        const noPrice = 1 - yesPrice;

        context += `Market: ${market.question || market.slug || market.conditionId}\n`;
        context += `Slug: ${market.slug}\n`;
        context += `Yes Price (Implied Probability): ${(yesPrice * 100).toFixed(2)}%\n`;
        context += `No Price (Implied Probability): ${(noPrice * 100).toFixed(2)}%\n`;
        context += `Liquidity: ${market.liquidity}\n`;
        context += `Volume (24hr): ${market.volume24hr}\n`;
        context += `Description: ${market.description}\n\n`;
      });
      context += `The user has asked: "${message}". Respond to the user briefly and conversationally based on this information.`;
    } else if (eventData?.title) {
      context = `You are a helpful and concise AI assistant discussing a prediction market event on Polymarket. Here is information about the event:\n\n`;
      context += `Title: ${eventData.title}\n`;
      context += `Description: ${eventData.description}\n`;
      context += `The user has asked: "${message}". Respond to the user briefly and conversationally based on this information.`;
    } else {
      return NextResponse.json({ reply: 'Sorry, I don\'t have enough information to discuss this market.' });
    }

    const payload = {
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: `You are a concise and friendly AI assistant that provides brief, conversational responses about Polymarket prediction markets. Avoid long messages think of a normal conversation with two humans.`,
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
    console.error('Error in /api/ai-chat-polymarket:', error);
    return NextResponse.json({ reply: 'Something went wrong on the server.' }, { status: 500 });
  }
}