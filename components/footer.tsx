'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const container = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        className='mt-10 relative h-full sm:pt-14 pt-8 bg-[#f7f7f7] text-black'
        ref={container}
      >
        <div className='sm:container px-4 mx-auto'>
          <div className='md:flex justify-between w-full'>
            <div className="flex items-start md:items-center">
              <div className="flex-grow">
                <h1 className='md:text-4xl text-2xl font-semibold'>
                  Route to the best prediction markets.
                </h1>
                <p className='text-gray-600 mt-2'>
                  PredictionRouter aggregates prices, liquidity, and sentiment across top platforms like Kalshi and Polymarket.
                  Compare markets side-by-side, track probabilities, and discover actionable opportunities — all in one place.
                </p>
                <p className='text-gray-600 mt-2'>
                  We don’t custody funds or execute trades. We guide you to where to trade with clear context and up-to-date data.
                </p>
              </div>
            </div>
            <div className='flex gap-10 mt-6 md:mt-0'>
              <ul>
                <li className='text-2xl pb-2 text-black font-semibold'>
                  NAVIGATION
                </li>
                <li className='text-xl font-medium'>
                  <Link href='/'>Home</Link>
                </li>
                <li className='text-xl font-medium'>
                  <Link href='/how-it-works'>How it Works</Link>
                </li>
                <li className='text-xl font-medium'>
                  <Link href='/app'>Kalshi</Link>
                </li>
                <li className='text-xl font-medium'>
                  <Link href='/polymarket'>Polymarket</Link>
                </li>
              </ul>
              <ul>
                <li className='text-2xl pb-2 text-black font-semibold'>
                  CONNECT
                </li>
                <li className='text-xl font-medium'>
                  <a
                    href='https://x.com'
                    target='_blank'
                    className='underline'
                  >
                    X.com
                  </a>
                </li>
                <li className='text-xl font-medium'>
                  <a
                    href='https://t.me'
                    target='_blank'
                    className='underline'
                  >
                    Telegram
                  </a>
                </li>
                <li className='text-xl font-medium'>
                  <a
                    href='https://github.com/SwarmMonkey/prediction-router'
                    target='_blank'
                    className='underline'
                  >
                    GitHub
                  </a>
                </li>
                {/* <li className='text-xl font-medium'>
                  <a
                    href='https://github.com/'
                    target='_blank'
                    className='underline'
                  >
                    GitHub
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
          <div className='flex md:flex-row flex-col-reverse gap-3 justify-between py-2 border-t-2 border-gray-200 mt-6'>
            <span className='font-medium'>
              &copy; {new Date().getFullYear()} PredictionRouter. All Rights Reserved.
            </span>
            <div className="flex gap-4">
         
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
