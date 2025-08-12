import { MarketsType } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { marketData } = body;

    if (!marketData) {
      return NextResponse.json(
        { error: 'Missing market data in request' },
        { status: 400 }
      );
    }

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    let context = '';

    if (Array.isArray(marketData?.markets) && marketData.markets.length > 1) {
      
      context = `Event: ${
        marketData.markets[0]?.title ||
        marketData.markets[0]?.event_ticker ||
        'Multiple Markets Event'
      }\n`;
      marketData.markets.forEach((market:MarketsType) => {
        context += `\nMarket: ${
          market.yes_sub_title || market.title || market.ticker
        }\n`;
        context += `Ticker: ${market.ticker}\n`;
        context += `Current Yes Bid: ${market.yes_bid}\n`;
        context += `Current Yes Ask: ${market.yes_ask}\n`;
        context += `Current No Bid: ${market.no_bid}\n`;
        context += `Current No Ask: ${market.no_ask}\n`;
        context += `${''}\n`;
      });
      context += `\nBased on the above information for all markets, provide a single, concise analysis of the overall sentiment and potential mispricings across these markets. Return the analysis as a JSON with fields: summary_reason, overall_confidence (0-100).`;
    } else if (marketData?.ticker) {
      // Single market: Create context as before
      context = `
Market: ${marketData.title || marketData.ticker || marketData.subtitle}
Ticker: ${marketData.ticker}
Current Yes Bid: ${marketData.yes_bid}
Current Yes Ask: ${marketData.yes_ask}
Current No Bid: ${marketData.no_bid}
Current No Ask: ${marketData.no_ask}
${marketData.description || ''}

Based on the above information, analyze whether the YES or NO contract is underpriced, and provide a confidence score (0-100) and reason. Return the analysis as a JSON with fields: ticker, side (yes/no), bid_price, reason, and confidence.
    `;
    } else {
      return NextResponse.json(
        { error: 'Invalid market data format' },
        { status: 400 }
      );
    }

    const payload = {
      model: 'sonar-reasoning-pro',
      messages: [
        {
          role: 'system',
          content: `You are a prediction market assistant that evaluates prices for event contracts on Kalshi. For each ticker, tell me if the 'yes' or 'no' contract is underpriced and why. Return a confidence score 0-100. Output a JSON object with these fields: side, ticker, bid_price, reason, confidence. For multi-market analysis, provide a single JSON object with fields: summary_reason, overall_confidence.`,
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
      const errorText = await response
        .text()
        .catch(() => 'No error details available');
      console.error('Perplexity API error:', response.status, errorText);
      return NextResponse.json(
        { error: `API error: ${response.status} - ${errorText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Perplexity API response data:', data);
    const content = data.choices[0].message.content;

    let parsedContent;
    try {
      const jsonRegex = /{[\s\S]*}/;
      const jsonMatch = content.match(jsonRegex);

      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed JSON from content');
      } else {
        parsedContent = JSON.parse(content);
        console.log('Successfully parsed content directly');
      }
    } catch (e: unknown) {
      console.log(
        'Direct parsing failed, trying to extract from markdown block',e
      );

      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedContent = JSON.parse(jsonMatch[1]);
          console.log('Successfully parsed content from markdown block');
        } catch (e) {
          console.error('Failed to parse JSON from markdown block:', e);
          return NextResponse.json(
            { error: 'Failed to parse response from AI' },
            { status: 500 }
          );
        }
      } else {
        console.error('Failed to extract JSON from response content');
        return NextResponse.json(
          { error: 'Failed to parse response from AI' },
          { status: 500 }
        );
      }
    }

    let analysisText = '';
    let rawResponse;

    if (
      Array.isArray(marketData?.markets) &&
      marketData.markets.length > 1 &&
      parsedContent?.summary_reason
    ) {
      analysisText = `Overall Analysis: ${parsedContent.summary_reason}\n\nConfidence: ${parsedContent.overall_confidence}/100`;
      rawResponse = { summary: parsedContent };
    } else if (parsedContent?.side) {
      const displayTitle =
        marketData.title || marketData.subtitle || parsedContent.ticker;
      analysisText = `Recommendation: Consider a ${parsedContent.side.toUpperCase()} order on "${displayTitle}" at ${
        parsedContent.bid_price
      }¢. ${parsedContent.reason}\n\nConfidence: ${
        parsedContent.confidence
      }/100`;
      rawResponse = parsedContent;
    } else {
      analysisText = 'Failed to generate a meaningful analysis.';
      rawResponse = {};
    }

    console.log('Returning analysis:', analysisText);
    return NextResponse.json({ analysis: analysisText, rawResponse });
  } catch (error) {
    console.error('Unhandled analysis error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to analyze market',
      },
      { status: 500 }
    );
  }
}
