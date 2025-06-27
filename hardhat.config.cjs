require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,//Infura API 
      accounts: [process.env.SEPOLIA_PRIVATE_KEY], //Sepolia account private key
      chainId: 11155111 // Sepolia's chain ID
    }
  }
};

