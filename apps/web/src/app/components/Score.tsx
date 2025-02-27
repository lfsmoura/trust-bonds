"use client";

import { useWallet } from "../../hooks/useWallet";
import { useReadContract } from "wagmi";
import { abi } from "../TrustBond.json";

interface ScoreProps {
  address?: string;
}

export default function Score({ address }: ScoreProps): JSX.Element {
  const { isConnected, address: connectedAddress } = useWallet();

  const { data: score, isLoading } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "score",
    args: [address || connectedAddress],
  });

  const calculateFallbackScore = (addr: string): string => {
    const lastChar = addr.slice(-1);
    const numericValue = parseInt(lastChar, 16);
    return ((numericValue / 15) * 100).toFixed(1);
  };

  if (!isConnected) {
    return <div>Connect your wallet to see the trust score</div>;
  }

  if (isLoading) {
    return <div>Loading score...</div>;
  }

  const displayScore =
    score?.toString() === "0"
      ? calculateFallbackScore(address || connectedAddress)
      : score?.toString() || "4.3";

  const scoreValue = parseFloat(displayScore);
  const strokeColor =
    scoreValue === 100 ? "#22c55e" : scoreValue > 50 ? "#facc15" : "#ef4444";
  const strokeDasharray = `${scoreValue}, 100`;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="text-xl font-semibold">Trust Score</div>
      <svg width="100" height="100" viewBox="0 0 36 36" className="mb-2">
        <path
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
        />
      </svg>
      <div className="text-3xl font-bold">{displayScore}</div>
    </div>
  );
}
