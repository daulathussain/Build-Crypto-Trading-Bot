export const routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap Router
export const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"; // Uniswap Quoter

export const ROUTER = (PROVIDER) => {
  const router = new ethers.Contract(
    routerAddress,
    [
      "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)",
    ],
    PROVIDER
  );
  return router;
};

export const QUOTER = (PROVIDER) => {
  const quoter = new ethers.Contract(
    quoterAddress,
    [
      "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public view returns (uint256 amountOut)",
    ],
    PROVIDER
  );
  return quoter;
};
export const TOKEN = (PROVIDER, TOKEN_B) => {
  const token = new ethers.Contract(
    TOKEN_B,
    [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) public view returns (uint256)",
    ],
    PROVIDER
  );
  return token;
};
