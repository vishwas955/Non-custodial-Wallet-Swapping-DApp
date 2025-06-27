const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { parseEther } = require("ethers");

module.exports = buildModule("SwapModule", (m) => {
  const tokenA = m.contract("TokenA");
  const tokenB = m.contract("TokenB");
  const swap = m.contract("SwapContract", [tokenA, tokenB]);

  m.call(tokenA, "transfer", [swap, parseEther("10000")]);
  m.call(tokenB, "transfer", [swap, parseEther("20000")]);

  return { tokenA, tokenB, swap };
});
