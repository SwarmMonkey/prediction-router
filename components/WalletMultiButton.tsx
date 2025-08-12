"use client";

import { FC } from 'react';
import { WalletMultiButton as SolanaWalletMultiButton } from '@solana/wallet-adapter-react-ui';

// This is a wrapper around the Solana WalletMultiButton that preserves styling and functionality
export const WalletMultiButton: FC = () => {
  return <SolanaWalletMultiButton className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors" />;
};

export default WalletMultiButton; 