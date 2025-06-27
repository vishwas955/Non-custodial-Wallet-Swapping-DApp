"use client";
import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import SwapForm from "@/components/SwapForm";

export default function Home() {
  const swapAddress = process.env.NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS;
  const tokenAAddress = process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS;
  const tokenBAddress = process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS;
  
  const [walletInfo, setWalletInfo] = useState(null);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Token Swap DApp (Sepolia Network)
      </h1>

      <WalletConnect onWalletConnected={setWalletInfo} />

      {walletInfo && (
        <SwapForm
          tokenA={tokenAAddress}
          tokenB={tokenBAddress}
          swap={swapAddress}
          walletInfo={walletInfo}
        />
      )}
    </main>
  );
}
