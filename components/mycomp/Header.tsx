'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <div className="flex flex-col sticky top-0 bg-white z-50">
      {/* Top Nav */}
      <div className="flex flex-row justify-between p-4">
        <h1 className="text-xl font-bold">MakertAgent</h1>
        <div className="flex gap-2">
          <Button variant="ghost">Login</Button>
          <Button>Sign Up</Button>
        </div>
      </div>

      <span className="underline w-full" />
    </div>
  );
}
