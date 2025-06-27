"use client";
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

const Tokens = [
  { key: "a", name: "Ethereum", symbol: "WETH" },
  { key: "b", name: "Tether", symbol: "USDT" },
];

export default function SwapForm({ tokenA, tokenB, swap, walletInfo }) {
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("aToB");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState(null);
  const [balances, setBalances] = useState({ a: "0", b: "0" });

  useEffect(() => {
    async function fetchAccountAndBalance() {
      if (!tokenA || !tokenB || !swap || !walletInfo?.address) return;
      const acc = walletInfo.address;
      setAccount(acc);

      if (!window.ethereum) {
        console.log("Install MetaMask");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const tokenAContract = new Contract(
        tokenA,
        ["function balanceOf(address) view returns (uint)"],
        provider
      );
      const tokenBContract = new Contract(
        tokenB,
        ["function balanceOf(address) view returns (uint)"],
        provider
      );

      const balA = await tokenAContract.balanceOf(acc);
      const balB = await tokenBContract.balanceOf(acc);
      setBalances({
        a: formatEther(balA),
        b: formatEther(balB),
      });
    }
    fetchAccountAndBalance();
  }, [tokenA, tokenB, swap, walletInfo, status]);

  const handleSwap = async () => {
    if (!tokenA || !tokenB || !swap || !walletInfo?.address) {
      setStatus("Contracts or wallet not ready");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenContract = new Contract(
        direction === "aToB" ? tokenA : tokenB,
        [
          "function approve(address,uint) external",
          "function allowance(address,address) view returns (uint)",
        ],
        signer
      );

      const amountWei = parseEther(amount);
      const currentAllowance = await tokenContract.allowance(walletInfo.address, swap);

      if (currentAllowance < amountWei) {
        const approveTx = await tokenContract.approve(swap, amountWei);
        await approveTx.wait();
      }

      const swapContract = new Contract(
        swap,
        ["function swapAtoB(uint) external", "function swapBtoA(uint) external"],
        signer
      );

      let tx;
      if (direction === "aToB") {
        tx = await swapContract.swapAtoB(amountWei);
      } else {
        tx = await swapContract.swapBtoA(amountWei);
      }
      await tx.wait();

      setStatus("Swap successful!");
      setAmount("");
    } catch (error) {
      setStatus("Swap failed: " + (error.reason || error.message));
      console.error(error);
    }
    setLoading(false);
  };

  const swapDirection = () => {
    setDirection(direction === "aToB" ? "bToA" : "aToB");
    setStatus("");
    setAmount("");
  };

  const fromToken = direction === "aToB" ? Tokens[0] : Tokens[1];
  const toToken = direction === "aToB" ? Tokens[1] : Tokens[0];

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="font-semibold">{fromToken.name}</span>
        </div>
        <button
          className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
          onClick={swapDirection}
          aria-label="Swap direction"
        >
          <span className="text-xl">⇅</span>
        </button>
        <div className="flex items-center">
          <span className="font-semibold">{toToken.name}</span>
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-sm text-gray-600 mb-1">
          Amount ({fromToken.symbol})
        </label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>
          Your {fromToken.symbol} balance:{" "}
          {Number(balances[fromToken.key]).toFixed(4)}
        </span>
        <span>
          Your {toToken.symbol} balance:{" "}
          {Number(balances[toToken.key]).toFixed(4)}
        </span>
      </div>
      <button
        onClick={handleSwap}
        disabled={loading || !amount}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-2"
      >
        {loading ? "Swapping..." : `Swap ${fromToken.symbol} → ${toToken.symbol}`}
      </button>
      <div className="text-center text-sm mt-2">
        {status && (
          <span
            className={
              status.startsWith("Swap successful")
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {status}
          </span>
        )}
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        {account && (
          <>
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </>
        )}
      </div>
    </div>
  );
}
