import { useAccount } from "wagmi";
import { config } from "../app/wagmi";

export function useWallet() {
  const { isConnected, address } = useAccount({
    config,
  });

  return {
    isConnected,
    address,
  };
}
