"use client";

import { useWallet } from "../hooks/useWallet";
import { useReadContract } from "wagmi";
import { abi } from "./TrustBond.json";
import Link from "next/link";

interface Bond {
  partner: string;
  amount: bigint;
}

interface BondListProps {
  address?: string;
}

export default function BondList({ address }: BondListProps): JSX.Element {
  const { isConnected, address: connectedAddress } = useWallet();

  const addressUsed = address || connectedAddress;

  const { data, isLoading } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "bonds",
    args: [addressUsed],
  });

  if (!isConnected && !address) {
    return <div>Connect your wallet to see your bonds</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const bonds = data as Bond[];

  const formatAddress = (addr: string) =>
    `0x${addr.slice(2, 6)}...${addr.slice(-4)}`;

  const calculateFallbackScore = (addr: string): string => {
    const lastChar = addr.slice(-1);
    const numericValue = parseInt(lastChar, 16);
    return ((numericValue / 15) * 100).toFixed(1);
  };

  const getScoreColor = (score: string): string => {
    const value = parseFloat(score);
    if (value === 100) return "#22c55e";
    if (value > 50) return "#facc15";
    return "#ef4444";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bond List</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 text-left w-1/3">Partner</th>
            <th className="py-2 px-4 bg-gray-200 text-left w-1/3">Amount</th>
            <th className="py-2 px-4 bg-gray-200 text-left w-1/3">
              Partner Trust Score
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left w-1/3">
              Bond Status
            </th>
          </tr>
        </thead>
        <tbody>
          {bonds.map((bond) => {
            const score = calculateFallbackScore(bond.partner);
            const scoreColor = getScoreColor(score);
            return (
              <tr key={bond.partner} className="border-b">
                <td className="py-2 px-4 w-1/3">
                  <Link
                    href={`/profile/${bond.partner}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {formatAddress(bond.partner)}
                  </Link>
                </td>
                <td className="py-2 px-4 w-1/3">{bond.amount.toString()}</td>
                <td className="py-2 px-4 w-1/3">
                  <span
                    className="px-3 py-1 rounded"
                    style={{
                      backgroundColor: `${scoreColor}20`,
                      color: scoreColor,
                    }}
                  >
                    {score}
                  </span>
                </td>
                <td className="py-2 px-4 w-1/3">
                  <Status user1={bond.partner} user2={addressUsed || ""} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Status({ user1, user2 }: { user1: string; user2: string }) {
  const { data, isLoading } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "bond",
    args: [user1, user2],
  }) as { data: { amount: bigint } | undefined; isLoading: boolean };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>{data?.amount.toString() === "0" ? "Pending" : "Active"}</div>;
}
