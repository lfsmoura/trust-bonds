"use client";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  useWriteContract,
  useSimulateContract,
  useAccount,
  useReadContract,
} from "wagmi";
import { parseUnits } from "viem";

// USDC contract approval address
const USDC_CONTRACT_ADDRESS = "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d"; //Currently using TrustBonds contract address for approval

// TrustBond contract address
const TRUST_BOND_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`; //TrustBonds contract address for token spending

// ERC20 approve function ABI
const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

// TrustBond deposit function ABI
const TRUST_BOND_ABI = [
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "partner", type: "address" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export function CreateForm() {
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);
  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);
  const [step, setStep] = useState("approve"); // "approve" or "deposit"

  // USDC has 6 decimals (unlike ETH which has 18)
  const parsedAmount = debouncedAmount
    ? parseUnits(debouncedAmount, 6)
    : undefined;

  // 1. First simulate the approve call
  const { data: approveData, error: approveError } = useSimulateContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "approve",
    args:
      step === "approve" && parsedAmount
        ? [TRUST_BOND_CONTRACT_ADDRESS, parsedAmount]
        : undefined,
  });

  // 2. Then simulate the deposit call
  const { data: depositData, error: depositError } = useSimulateContract({
    address: TRUST_BOND_CONTRACT_ADDRESS,
    abi: TRUST_BOND_ABI,
    functionName: "deposit",
    args:
      step === "deposit" && debouncedTo && parsedAmount
        ? [parsedAmount, debouncedTo]
        : undefined,
  });

  // Execute the contract write
  const { writeContract, isPending } = useWriteContract();

  const handleSendTransaction = () => {
    if (step === "approve" && approveData?.request) {
      writeContract(approveData.request, {
        onSuccess: () => {
          setStep("deposit");
        },
      });
    } else if (step === "deposit" && depositData?.request) {
      writeContract(depositData.request, {
        onSuccess: () => {
          setStep("success");
          setTo("");
          setAmount("");
        },
      });
    }
  };

  // Debug values
  const isToValid = Boolean(debouncedTo);
  const isAmountValid = Boolean(parsedAmount);
  const currentSimulateData = step === "approve" ? approveData : depositData;
  const currentError = step === "approve" ? approveError : depositError;

  const getButtonText = () => {
    if (isPending) return "Processing...";
    if (step === "approve") return "Approve USDC";
    return "Create Bond";
  };

  if (step === "success") {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-2xl font-bold text-green-600 bg-green-50 px-8 py-4 rounded-lg shadow-md animate-fade-in">
          Bond created successfully! 🎉
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <TokenBalance />
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendTransaction();
        }}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="partner"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Partner Address
            </label>
            <input
              id="partner"
              aria-label="partner address"
              disabled={step === "deposit" && isPending}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              value={to}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (USDC)
            </label>
            <input
              id="amount"
              aria-label="amount"
              type="number"
              step="0.01"
              placeholder="10"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              disabled={step === "deposit" && isPending}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!currentSimulateData?.request || isPending}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors
            ${
              !currentSimulateData?.request || isPending
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {getButtonText()}
        </button>
      </form>

      {/* Debug information - Collapsible section */}
      <div className="mt-8">
        <details className="bg-gray-50 rounded-lg">
          <summary className="cursor-pointer p-4 font-medium text-gray-700">
            Debug Information
          </summary>
          <div className="px-4 pb-4 text-sm space-y-2">
            <ul className="space-y-1">
              <li>
                Current step: <span className="font-mono">{step}</span>
              </li>
              <li>Partner address valid: {isToValid ? "✅" : "❌"}</li>
              <li>Amount valid: {isAmountValid ? "✅" : "❌"}</li>
              <li>Simulate data exists: {currentSimulateData ? "✅" : "❌"}</li>
              <li>
                Simulate request exists:{" "}
                {currentSimulateData?.request ? "✅" : "❌"}
              </li>
              <li>Is pending: {isPending ? "✅" : "❌"}</li>
              {currentError && (
                <li className="text-red-500">Error: {currentError.message}</li>
              )}
            </ul>
            <div className="mt-2 space-y-1">
              <p>
                Partner address:{" "}
                <span className="font-mono">{debouncedTo || "Not set"}</span>
              </p>
              <p>
                Amount:{" "}
                <span className="font-mono">
                  {debouncedAmount || "Not set"}
                </span>
              </p>
              <p>
                Parsed amount:{" "}
                <span className="font-mono">
                  {parsedAmount?.toString() || "Not set"}
                </span>
              </p>
              <p>
                Contract address:{" "}
                <span className="font-mono break-all">
                  {TRUST_BOND_CONTRACT_ADDRESS}
                </span>
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}

function TokenBalance() {
  const { address } = useAccount();
  const { data: balance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
  }) as { data: bigint | undefined };

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">Your USDC Balance:</span>
      <span className="font-medium">{balance?.toString() || "0"} USDC</span>
    </div>
  );
}
