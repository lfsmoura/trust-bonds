"use client";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useWriteContract, useSimulateContract } from "wagmi";
import { parseUnits } from "viem";

// USDC contract approval address
const USDC_CONTRACT_ADDRESS = "0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D"; //Currently using TrustBonds contract address for approval

// TrustBond contract address
const TRUST_BOND_CONTRACT_ADDRESS = "0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D"; //TrustBonds contract address for token spending

// ERC20 approve function ABI
const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// TrustBond deposit function ABI
const TRUST_BOND_ABI = [
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "partner", type: "address" }
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export function SendTransaction() {
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);
  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);
  const [step, setStep] = useState("approve"); // "approve" or "deposit"

  // USDC has 6 decimals (unlike ETH which has 18)
  const parsedAmount = debouncedAmount ? parseUnits(debouncedAmount, 6) : undefined;

  // 1. First simulate the approve call
  const { data: approveData, error: approveError } = useSimulateContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: step === "approve" && TRUST_BOND_CONTRACT_ADDRESS && parsedAmount
      ? [TRUST_BOND_CONTRACT_ADDRESS, parsedAmount]
      : undefined,
  });

  // 2. Then simulate the deposit call
  const { data: depositData, error: depositError } = useSimulateContract({
    address: TRUST_BOND_CONTRACT_ADDRESS,
    abi: TRUST_BOND_ABI,
    functionName: 'deposit',
    args: step === "deposit" && debouncedTo && parsedAmount
      ? [parsedAmount, debouncedTo]
      : undefined,
  });

  // Execute the contract write
  const { writeContract, isPending } = useWriteContract();

  const handleSendTransaction = () => {
    if (step === "approve" && approveData?.request) {
      writeContract(approveData.request, {
        onSuccess: () => setStep("deposit")
      });
    } else if (step === "deposit" && depositData?.request) {
      writeContract(depositData.request, {
        onSuccess: () => {
          setStep("approve");
          setTo("");
          setAmount("");
        }
      });
    }
  };

  // Debug values
  const isToValid = Boolean(debouncedTo);
  const isAmountValid = Boolean(parsedAmount);
  const currentSimulateData = step === "approve" ? approveData : depositData;
  const currentError = step === "approve" ? approveError : depositError;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendTransaction();
        }}
      >
        <div className="flex flex-row gap-x-2">
          <input
            aria-label="partner address"
            placeholder="Partner address (0x...)"
            onChange={(e) => setTo(e.target.value)}
            value={to}
            disabled={step === "deposit" && isPending}
          />
          <input
            aria-label="amount"
            type="number"
            step="0.01"
            placeholder="10 USDC"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            disabled={step === "deposit" && isPending}
          />
        </div>
        <button
          type="submit"
          disabled={!currentSimulateData?.request || isPending}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isPending
            ? 'Processing...'
            : step === "approve"
              ? 'Approve USDC'
              : 'Create Bond'}
        </button>
      </form>

      {/* Debug information */}
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-bold">Debug Info:</h3>
        <ul>
          <li>Current step: {step}</li>
          <li>Partner address valid: {isToValid ? '✅' : '❌'}</li>
          <li>Amount valid: {isAmountValid ? '✅' : '❌'}</li>
          <li>Simulate data exists: {Boolean(currentSimulateData) ? '✅' : '❌'}</li>
          <li>Simulate request exists: {Boolean(currentSimulateData?.request) ? '✅' : '❌'}</li>
          <li>Is pending: {isPending ? '✅' : '❌'}</li>
          {currentError && (
            <li className="text-red-500">Error: {currentError.message}</li>
          )}
        </ul>
        <div className="mt-2">
          <p>Partner address: {debouncedTo || 'Not set'}</p>
          <p>Amount: {debouncedAmount || 'Not set'}</p>
          <p>Parsed amount: {parsedAmount?.toString() || 'Not set'}</p>
          <p>Contract address: {TRUST_BOND_CONTRACT_ADDRESS}</p>
        </div>
      </div>
    </div>
  );
}