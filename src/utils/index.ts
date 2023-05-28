export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const truncateAddress = (address: string) => {
  return address.slice(0, 4) + "..." + address.slice(-4);
};

export const ipfsToHttps = (url: string) => {
  return url.replace("ipfs://", "https://ipfs.io/ipfs/");
};
