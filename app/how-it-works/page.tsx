import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | PredictionRouter',
  description: 'Learn how PredictionRouter aggregates prediction markets and helps you make better forecasting decisions.',
  keywords: ['prediction market guide', 'AI forecasting', 'prediction market analysis', 'how prediction markets work'],
  openGraph: {
    title: 'How PredictionRouter Works | Market Aggregation',
    description: 'Discover how we aggregate prediction markets across platforms to give you the best insights for informed decision making.',
    images: [{ url: '/prediction.png', width: 1200, height: 630, alt: 'PredictionRouter How It Works' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How PredictionRouter Works | Market Aggregation',
    description: 'Discover how we aggregate and analyze prediction markets to help you make better forecasting decisions.',
    images: ['/prediction.png'],
  },
};

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Manifesto Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">PredictionRouter</h2>
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed mb-4">
            We believe that prediction markets are powerful tools for forecasting the future and aggregating knowledge.
            However, the complexity of these markets often creates barriers to entry for many potential users.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Our mission is to democratize access to prediction markets by leveraging the latest in artificial 
            intelligence to help individuals make more informed decisions and navigate the complex landscape of 
            prediction platforms.
          </p>
          <p className="text-lg leading-relaxed">
            We don&apos;t think you need to be a statistician or expert forecaster to participate in prediction markets. 
            With the right tools and insights, anyone can become a successful predictor.
          </p>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Approach</h2>
        
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <div className="bg-white/5 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-medium mb-3">AI-Powered Insights</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We use advanced AI models to analyze prediction market data, identify pricing inefficiencies, 
              and generate insights that would be difficult for individuals to discover on their own.
            </p>
          </div>
          
          <div className="bg-white/5 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-medium mb-3">Market Aggregation</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Rather than creating yet another prediction market, we aggregate data from established platforms, 
              giving you a comprehensive view of the prediction landscape across multiple markets.
            </p>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">The Process</h3>
        
        <ol className="space-y-6 mb-8">
          <li className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">1</div>
            <div>
              <h4 className="font-medium">Scan Multiple Markets</h4>
              <p className="text-gray-700 dark:text-gray-300">Our system continuously monitors major prediction markets, tracking odds, volumes, and market movements.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">2</div>
            <div>
              <h4 className="font-medium">Apply AI Analysis</h4>
              <p className="text-gray-700 dark:text-gray-300">Our AI models analyze this data alongside relevant news, social media sentiment, and historical patterns.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">3</div>
            <div>
              <h4 className="font-medium">Generate Actionable Insights</h4>
              <p className="text-gray-700 dark:text-gray-300">We transform complex data into clear, actionable recommendations that help you make informed decisions.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">4</div>
            <div>
              <h4 className="font-medium">Guide You to the Right Platform</h4>
              <p className="text-gray-700 dark:text-gray-300">Based on your interests and our analysis, we direct you to the specific prediction market where you can place your bet.</p>
            </div>
          </li>
        </ol>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-900 mt-8">
          <h3 className="text-xl font-medium mb-3 text-blue-800 dark:text-blue-300">Important Note</h3>
          <p className="text-gray-700 dark:text-gray-300">
            We are not a prediction market exchange. We don&apos;t hold your funds or execute trades on your behalf. 
            We simply provide intelligence and guidance to help you win on established prediction market platforms.
          </p>
        </div>
      </section>
    </div>
  );
}