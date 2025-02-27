"use client";

import { useReadContract } from "wagmi";
import { abi } from "./TrustBond.json";
import { formatEther } from "viem";
import { useEffect, useState } from "react";

export default function CommunityPool(): JSX.Element {
  const [defaultValue, setDefaultValue] = useState(15302);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const { data: balance, isLoading } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "communityPoolBalance",
  });

  useEffect(() => {
    const calculateDefaultValue = () => {
      const startDate = new Date("2024-12-01T00:00:00Z");
      const now = new Date();
      const diffInSeconds = (now.getTime() - startDate.getTime()) / 1000;
      const intervals = Math.floor(diffInSeconds / 3);
      const baseValue = 15302;
      return baseValue + intervals * 3;
    };

    const timer = setInterval(() => {
      setDefaultValue(calculateDefaultValue());
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1000);
    }, 3000);

    // Initial calculation
    setDefaultValue(calculateDefaultValue());

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (isLoading) {
    return <div>Loading community pool balance...</div>;
  }

  return (
    <div className="text-center mb-4">
      <h2 className="text-3xl font-bold mb-6">Community Pool</h2>
      <p className="text-xl">
        $
        <span
          className={`transition-colors duration-1000 ${
            isHighlighted ? "bg-yellow-200" : "bg-transparent"
          }`}
        >
          {balance
            ? formatEther(balance as bigint)
            : defaultValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </span>{" "}
        USDC Locked by the community
      </p>
    </div>
  );
}
