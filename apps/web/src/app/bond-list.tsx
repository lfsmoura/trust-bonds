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

  const { data, isLoading } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "bonds",
    args: [address || connectedAddress],
  });

  if (!isConnected) {
    return <div>Connect your wallet to see your bonds</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const bonds = data as Bond[];

  // If address is provided, filter bonds for that address
  // If not, show all bonds or the connected user's bonds
  const filteredBonds = address
    ? bonds.filter(
        (bond) => bond.partner === address || bond.partner === connectedAddress
      )
    : bonds;

  const formatAddress = (addr: string) =>
    `0x${addr.slice(2, 6)}...${addr.slice(-4)}`;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bond List</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 text-left">Partner</th>
            <th className="py-2 px-4 bg-gray-200 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredBonds.map((bond) => (
            <tr key={bond.partner} className="border-b">
              <td className="py-2 px-4">
                <Link
                  href={`/profile/${bond.partner}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {formatAddress(bond.partner)}
                </Link>
              </td>
              <td className="py-2 px-4">{bond.amount.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
