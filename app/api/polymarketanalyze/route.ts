import {  PolymarketMarket } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { marketData, eventData } = body; 

    if (!marketData && !eventData) {
      return NextResponse.json(
        { error: 'Missing market or event data in request' },
        { status: 400 }
      );
    }

    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    let context = '';

    if (eventData?.markets && eventData.markets.length > 1) {
      context = `Event: ${eventData.title}\nDescription: ${eventData.description}\n\n`;
      eventData.markets.forEach((market: PolymarketMarket) => {
        let outcomePrices: string[] = [];
        try {
          outcomePrices = typeof market.outcomePrices === 'string' ? JSON.parse(market.outcomePrices) : [];
        } catch (e) {
          console.error('Error parsing outcomePrices:', e);
        }
        const yesPrice = outcomePrices[0];
        const noPrice = outcomePrices[1];

        context += `Market: ${market.question}\n`;
        context += `Yes Probability: ${yesPrice ? parseFloat(yesPrice) * 100 : 'N/A'}%\n`;
        context += `No Probability: ${noPrice ? parseFloat(noPrice) * 100 : 'N/A'}%\n`;
        context += `Liquidity: ${market.liquidity}\nVolume: ${market.volume}\n\n`;
      });
      context += `Based on the above information for all markets, provide a single, concise analysis of the overall sentiment and potential mispricings across these markets. Focus on the probabilities and trading activity. Return the analysis as a JSON with fields: summary_reason, overall_confidence (0-100).`;
    } else if (marketData) {
      let outcomePrices: string[] = [];
      try {
        outcomePrices = typeof marketData.outcomePrices === 'string' ? JSON.parse(marketData.outcomePrices) : [];
      } catch (e) {
        console.error('Error parsing outcomePrices:', e);
      }
      const yesPrice = outcomePrices[0];
      const noPrice = outcomePrices[1];

      context = `Market Question: ${marketData.question}\n`;
      context += `Description: ${marketData.description}\n`;
      context += `Yes Probability: ${yesPrice ? parseFloat(yesPrice) * 100 : 'N/A'}%\n`;
      context += `No Probability: ${noPrice ? parseFloat(noPrice) * 100 : 'N/A'}%\n`;
      context += `Liquidity: ${marketData.liquidity}\nVolume: ${marketData.volume}\n\n`;
      context += `Based on the above information, analyze whether the YES or NO outcome seems mispriced. Provide a confidence score (0-100) and the reasoning. Return the analysis as a JSON with fields: outcome (yes/no), probability, reason, and confidence.`;
    } else {
      return NextResponse.json(
        { error: 'Invalid data format for analysis' },
        { status: 400 }
      );
    }

    const payload = {
      model: 'sonar-reasoning-pro',
      messages: [
        {
          role: 'system',
          content: `You are a prediction market assistant that evaluates probabilities for event contracts on Polymarket. For each market, analyze if the 'yes' or 'no' outcome seems mispriced based on the current probability, liquidity, and volume. Return a confidence score 0-100. Output a JSON object with the analysis. For multi-market analysis, provide a single JSON object with fields: summary_reason, overall_confidence. For a single market, output fields: outcome (yes/no), probability, reason, confidence.`,
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
        'Direct parsing failed, trying to extract from markdown block',
        e
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

    if (eventData?.markets?.length > 1 && parsedContent?.summary_reason) {
      analysisText = `Overall Analysis: ${parsedContent.summary_reason}\n\nConfidence: ${parsedContent.overall_confidence}/100`;
      rawResponse = { summary: parsedContent };
    } else if (parsedContent?.outcome) {
      analysisText = `Recommendation: The '${parsedContent.outcome.toUpperCase()}' outcome has a probability of ${
        parsedContent.probability
      }%. ${parsedContent.reason}\n\nConfidence: ${parsedContent.confidence}/100`;
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