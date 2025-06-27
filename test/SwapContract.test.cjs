const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SwapContract with rate 2400", function () {
  let TokenA, TokenB, SwapContract;
  let tokenA, tokenB, swap;
  let deployer, user1;

  const liquidityAmount = ethers.utils.parseEther("10000");
  const swapAmount = ethers.utils.parseEther("10");

  beforeEach(async function () {
    [deployer, user1] = await ethers.getSigners();

    TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.deploy();
    await tokenA.deployed();

    TokenB = await ethers.getContractFactory("TokenB");
    tokenB = await TokenB.deploy();
    await tokenB.deployed();

    const Swap = await ethers.getContractFactory("SwapContract");
    swap = await Swap.deploy(tokenA.address, tokenB.address);
    await swap.deployed();

    await tokenA.transfer(swap.address, liquidityAmount);
    await tokenB.transfer(swap.address, liquidityAmount);

    await tokenA.transfer(user1.address, swapAmount);
    await tokenB.transfer(user1.address, swapAmount);
  });

  it("should have correct initial liquidity", async function () {
    const swapBalanceA = await tokenA.balanceOf(swap.address);
    const swapBalanceB = await tokenB.balanceOf(swap.address);

    expect(swapBalanceA).to.equal(liquidityAmount);
    expect(swapBalanceB).to.equal(liquidityAmount);
  });

  it("should swap TokenA to TokenB correctly with rate 2400", async function () {
    await tokenA.connect(user1).approve(swap.address, swapAmount);

    const expectedTokenB = swapAmount.mul(2400);

    
    await expect(swap.connect(user1).swapAtoB(swapAmount))
      .to.emit(swap, "Swapped")
      .withArgs(user1.address, tokenA.address, tokenB.address, swapAmount, expectedTokenB);

    
    const user1TokenABalance = await tokenA.balanceOf(user1.address);
    const user1TokenBBalance = await tokenB.balanceOf(user1.address);

    expect(user1TokenABalance).to.equal(0); 
    expect(user1TokenBBalance).to.equal(expectedTokenB);
  });

  it("should swap TokenB to TokenA correctly with rate 2400", async function () {
    await tokenB.connect(user1).approve(swap.address, swapAmount);

    const expectedTokenA = swapAmount.div(2400);

    await expect(swap.connect(user1).swapBtoA(swapAmount))
      .to.emit(swap, "Swapped")
      .withArgs(user1.address, tokenB.address, tokenA.address, swapAmount, expectedTokenA);

    const user1TokenBBalance = await tokenB.balanceOf(user1.address);
    const user1TokenABalance = await tokenA.balanceOf(user1.address);

    expect(user1TokenBBalance).to.equal(0);
    expect(user1TokenABalance).to.equal(expectedTokenA);
  });
});
