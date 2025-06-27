## **Token Swap DApp**

This project is a decentralized application (dApp) that allows users to swap between two ERC-20 tokens at a fixed exchange rate (1 WETH = 2400 USDT). It is built using Solidity smart contracts and integrates with a React-based frontend powered by Next.js and Ethers.js. Hardhat Ignition is used for development, testing, and deployment.

## **Features**
* Deploy and manage two ERC-20 tokens (WETH and USDT)

* Swap tokens at a fixed rate of 1 WETH = 2400 USDT

* Connect with MetaMask wallet or create a non-custodial wallet

* Interact with Sepolia Testnet

* Contract deployment and token transfers managed via Hardhat Ignition modules

* Frontend built with Next.js and styled with Tailwind CSS

## **Tech Stack**
* Solidity (0.8.28)

* Hardhat & Hardhat Ignition

* Ethers.js v6

* Next.js (React)

* Tailwind CSS

* OpenZeppelin Contracts

## **Project Structure**
```bash
Token-Swap/
├── contracts/            # Solidity contracts (TokenA, TokenB, SwapContract)
├── ignition/             # Hardhat Ignition deployment module
├── test/                 # Hardhat tests
├── src/components/       # React components (WalletConnect, SwapForm)
├── src/app/              # Next.js frontend
├── hardhat.config.js     # Hardhat configuration
├── package.json          # Project dependencies
├── .env.local            # Environment variables (not committed)
```

# #**Prerequisites**
* MetaMask browser extension

* Sepolia ETH (can be requested from a faucet)


## **Installation**

 1. Clone the repository:

```bash
git clone https://github.com/vishwas955/Non-custodial-Wallet-Swapping-DApp.git
cd Swapping-DEX
```

 2. Install dependencies:

```bash
npm install
```

 3. Compilation
Smart contracts will compile automatically during deployment or testing. To compile manually:

```bash
npx hardhat compile
```

## **Deployment**

 1. Create a .env.local file in the root with the following variables:

```text
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_api_key
```

2. Deploy contracts:

```bash
npx hardhat ignition --network sepolia
```
This will deploy TokenA, TokenB, and SwapContract, then transfer liquidity to the swap contract automatically.

 3. After deployment, update your .env with the deployed contract addresses:

```text
NEXT_PUBLIC_SWAP_ADDRESS=0xDeployedSwapContractAddress
NEXT_PUBLIC_TOKEN_A_ADDRESS=0xDeployedTokenAAddress
NEXT_PUBLIC_TOKEN_B_ADDRESS=0xDeployedTokenBAddress
```

## **Running the Frontend**
Start the Next.js development server:

```bash
npm run dev
```

Open your browser and visit http://localhost:3000 to access the dApp.

## **Wallet Connection**
MetaMask: Click "Connect MetaMask" to connect your injected wallet.

Non-Custodial Wallet: Click "Create Wallet" to generate a wallet using a seed phrase. Save your seed phrase securely!

