"use client";

import { useMetaMask } from "@/hooks/useMetaMask";
import { truncateAddress } from "@/utils";

export default function ConnectButton() {
  const { isConnecting, connectMetaMask, wallet } = useMetaMask();
  return (
    <button
      className="w-28 h-10 border border-black ml-auto"
      onClick={() => connectMetaMask()}
    >
      {wallet.accounts[0] ? truncateAddress(wallet.accounts[0]) : "Connect"}
    </button>
  );
}
