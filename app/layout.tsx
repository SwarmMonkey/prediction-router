import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/footer";
import WalletContextProvider from "../components/WalletContextProvider";
import Menu from "@/components/menu";
import SeparatorComponent from "@/components/mycomp/SeparatorComponent";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-0R9HDMJ0EP";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PredictionRouter | Prediction Market Aggregator",
  description: "PredictionRouter is a prediction market aggregator for informed decision making. Built on top of Kalshi and Polymarket.",
  keywords: ["prediction market", "aggregator", "Kalshi", "Polymarket", "PredictionRouter", "trading", "forecast"],
  openGraph: {
    title: "PredictionRouter | Prediction Market Aggregator",
    description: "Make informed decisions with our prediction market aggregator. Built on top of Kalshi and Polymarket.",
    siteName: "PredictionRouter",
    images: [
      {
        url: "/prediction.png",
        width: 1200,
        height: 630,
        alt: "PredictionRouter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PredictionRouter | Prediction Market Aggregator",
    description: "Make informed decisions with our prediction market aggregator. Built on top of Kalshi and Polymarket.",
    images: ["/prediction.png"],
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-blue-600 py-2 px-3 text-center text-white text-sm font-medium">
          <span className="inline-block">CA: </span>
          <span className="inline-block break-all truncate max-w-full">EUwvqww7U1nsDAKQ748hooGSLCLgKuQMeVHS5VHjjZzZ</span>
        </div>
        <WalletContextProvider>
          <Menu/>
          <div className="mx-auto max-w-[1400px]"> 
            <SeparatorComponent />
            {children}
          </div>
          <Footer />
        </WalletContextProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
