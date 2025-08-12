"use client"

import { useRef, useEffect, useState } from "react"
import { TimelineContent } from "@/components/ui/framer-timeline"
import type { Variants } from "framer-motion"
import { motion, useScroll, useTransform } from "framer-motion"
import RandomizedTextEffect from "@/components/text-randomize"
import Image from "next/image"
import Link from "next/link"
import { Send } from "lucide-react"
import { Inter } from 'next/font/google'

// Load fonts
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '700'], display: 'swap' })

// Custom X.com Logo component
const XLogo = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" 
      fill="currentColor"
    />
  </svg>
);

function MinimalHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Setup scroll-based animation with more pronounced effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"]
  })

  // Enhanced transform values for more noticeable effects
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, 7])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9])

  // Subtle reveal animation
  const revealVariants: Variants = {
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hidden: {
      opacity: 0,
      y: 15,
    },
  }

  // Handle SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className={`bg-black w-full min-h-screen flex flex-col ${inter.className}`}>
      {/* First section - Hero */}
      <section 
        ref={heroRef} 
        className="flex-1 px-4 py-6 max-w-6xl mx-auto flex flex-col justify-start items-center text-center text-white"
      >
        <TimelineContent
          as="h1"
          animationNum={0}
          timelineRef={heroRef}
          variants={revealVariants}
          className="text-7xl md:text-8xl font-bold mb-4 text-white tracking-tight"
        >
          PredictionRouter
        </TimelineContent>

        <TimelineContent
          as="h2"
          animationNum={1}
          timelineRef={heroRef}
          variants={revealVariants}
          className="text-4xl md:text-5xl font-medium mb-3 max-w-4xl leading-tight text-white"
        >
          Prediction market aggregator.
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={heroRef}
          variants={revealVariants}
          className="text-lg md:text-xl text-gray-300 mb-5 max-w-3xl"
        >
          Aggregate markets for informed decision making. Built on top of Kalshi and Polymarket. 
        </TimelineContent>

        <div className="mt-3">
          <RandomizedTextEffect text="Predict the future." />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          <TimelineContent 
            as="div" 
            animationNum={3} 
            timelineRef={heroRef}
            variants={revealVariants}
            className="flex flex-col items-center"
          >
            <div ref={imageRef} className="my-3 overflow-hidden rounded-lg shadow-md p-2">
              {isMounted && (
                <motion.div
                  style={{ 
                    y: imageY,
                    scale: imageScale,
                    rotate: imageRotate,
                    opacity: imageOpacity
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { duration: 0.8 }
                  }}
                  whileInView={{
                    y: 0,
                    transition: { duration: 1.5, ease: "easeOut" }
                  }}
                  viewport={{ once: false }}
                >
                  <Image
                    src="/prediction.png"
                    alt="Prediction Market"
                    width={500}
                    height={350}
                    className="transform-gpu rounded-md"
                    priority
                    style={{ 
                      objectFit: "contain",
                      maxWidth: "100%",
                      height: "auto"
                    }}
                  />
                </motion.div>
              )}
            </div>
          
            <div className="mt-6 flex items-center justify-center gap-6">
              <Link href="https://x.com/AimbotFnF" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <XLogo size={22} />
                <span className="sr-only">X.com</span>
              </Link>
              <Link href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <Send size={24} />
                <span className="sr-only">Telegram</span>
              </Link>
            </div>
          
          </TimelineContent>
        </div>
      </section>
    </div>
  )
}

export default MinimalHero 