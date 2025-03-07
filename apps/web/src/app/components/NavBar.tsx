"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ChainIcon } from "./ChainIcon";

export default function NavBar() {
  const { isConnected } = useAccount();

  return (
    <nav className="w-full flex flex-col md:flex-row justify-between items-center p-4 gap-4">
      <Link
        href="/"
        className="text-2xl md:text-4xl font-bold flex items-center"
      >
        <ChainIcon />
        TrustBonds
        <span className="ml-2 md:ml-4 text-[10px] md:text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-normal">
          powered by Scroll
        </span>
      </Link>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <ConnectButton />
        {isConnected && (
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Link
              href="/profile"
              className="w-full md:w-auto px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              My Profile
            </Link>
            <Link
              href="/create"
              className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
