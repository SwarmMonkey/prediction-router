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
            <div className="flex items-start md:items-center gap-4">
              <Image
                src="/PredictionRouter_logo.png?v=2"
                alt="PredictionRouter"
                width={72}
                height={72}
                className="rounded-md"
                priority
              />
              <div className="flex-grow">
                <h1 className='md:text-3xl text-xl font-semibold'>
                  Predict smarter.
                </h1>
                <p className='text-gray-600 mt-2'>
                  Aggregated markets and AI insights — in one place.
                </p>
              </div>
            </div>
            <div className='flex gap-10 mt-6 md:mt-0'>
              <ul>
                 <li className='text-lg pb-2 text-black font-semibold'>
                  Navigation
                </li>
                <li className='text-base font-medium'>
                  <Link href='/'>Home</Link>
                </li>
                <li className='text-base font-medium'>
                  <Link href='/how-it-works'>How it Works</Link>
                </li>
                <li className='text-base font-medium'>
                  <Link href='/app'>Kalshi</Link>
                </li>
                <li className='text-base font-medium'>
                  <Link href='/polymarket'>Polymarket</Link>
                </li>
              </ul>
              <ul>
                <li className='text-lg pb-2 text-black font-semibold'>Connect</li>
                <li className='text-base font-medium'>
                  <a
                    href='https://x.com'
                    target='_blank'
                    className='underline'
                  >
                    X.com
                  </a>
                </li>
                <li className='text-base font-medium'>
                  <a
                    href='https://t.me'
                    target='_blank'
                    className='underline'
                  >
                    Telegram
                  </a>
                </li>
                <li className='text-base font-medium'>
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
