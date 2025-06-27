// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapContract {
    IERC20 public tokenA;
    IERC20 public tokenB;
    uint public constant Rate = 2400; // 1 ETH = 2400 USDT

    event Swapped(address indexed user, address indexed tokenIn, address indexed tokenOut, uint amountIn, uint amountOut);

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function swapAtoB(uint amountA) external {
        require(amountA > 0, "Amount must be > 0");
        uint amountB = (amountA * Rate); 
        require(tokenB.balanceOf(address(this)) >= amountB, "Insufficient liquidity");

        require(tokenA.transferFrom(msg.sender, address(this), amountA), "TokenA transfer failed");
        require(tokenB.transfer(msg.sender, amountB), "TokenB transfer failed");

        emit Swapped(msg.sender, address(tokenA), address(tokenB), amountA, amountB);
    }

    function swapBtoA(uint amountB) external {
        require(amountB > 0, "Amount must be > 0");
        uint amountA = amountB/Rate; 
        require(tokenA.balanceOf(address(this)) >= amountA, "Insufficient liquidity");

        require(tokenB.transferFrom(msg.sender, address(this), amountB), "TokenB transfer failed");
        require(tokenA.transfer(msg.sender, amountA), "TokenA transfer failed");

        emit Swapped(msg.sender, address(tokenB), address(tokenA), amountB, amountA);
    }
}
