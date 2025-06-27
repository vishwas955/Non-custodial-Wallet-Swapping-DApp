"use client";

import { useState } from "react";
import { HDNodeWallet } from "ethers";

export default function WalletConnect({ onWalletConnected }) {
  const [account, setAccount] = useState(null);
  const [mnemonic, setMnemonic] = useState("");

  // Connect MetaMask injected wallet
  const connectInjected = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const connectedAccount = accounts[0];
      setAccount(connectedAccount);
      onWalletConnected({
        type: "injected",
        address: connectedAccount,
      });
    } catch {
      alert("Connection rejected.");
    }
  };

  // Create a new non-custodial wallet and display info
  const createWallet = () => {
    const wallet = HDNodeWallet.createRandom();
    setMnemonic(wallet.mnemonic.phrase);
    setAccount(wallet.address); 
    onWalletConnected({
      type: "non-custodial",
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Wallet Connection</h2>
      <div className="flex gap-3 mb-4">
        <button
          onClick={connectInjected}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
        >
          Connect MetaMask
        </button>
        <button
          onClick={createWallet}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900 flex-1"
        >
          Create Wallet
        </button>
      </div>

      {account && (
        <div className="text-green-600 font-mono space-y-2">
          <p>
            <strong>Connected Wallet Address:</strong> {account}
          </p>
          {mnemonic && (
            <p className="break-words">
              <strong>Seed Phrase:</strong> {mnemonic}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
