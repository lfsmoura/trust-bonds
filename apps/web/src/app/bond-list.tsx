"use client";

import { useAccount } from "wagmi";
import { config } from "./wagmi";
import { useReadContract } from "wagmi";
import { abi } from "./TrustBond.json";

interface Bond {
  partner: string;
  amount: bigint;
}

export default function BondList() {
  const { isConnected, address } = useAccount({
    config,
  });

  const { data, isLoading } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "bonds",
    args: [address],
  });

  if (!isConnected) {
    return <div>Connect your wallet to see your bonds</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const bonds = (data as Bond[]) || [];

  return (
    <div>
      <h2>BondList</h2>
      <ul>
        {bonds.map((bond) => (
          <li key={bond.partner}>
            {bond.partner} - amount = {bond.amount.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
