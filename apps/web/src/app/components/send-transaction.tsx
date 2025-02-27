"use client";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";

export function SendTransaction() {
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);
  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { sendTransaction } = useSendTransaction();

  return (

    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (debouncedTo && debouncedAmount) {
          sendTransaction({
            to: debouncedTo as `0x${string}`,
            value: parseEther(debouncedAmount)
          });
        }
      }}
    >
      <div className="flex flex-col gap-10">
        <input
          aria-label="address"
          placeholder="0x..."
          onChange={(e) => setTo(e.target.value)}
          value={to}
        />
        <input
          aria-label="amount"
          type="number"
          step="0.001"
          placeholder="1 ETH"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
      </div>
      <button className="bg-blue-500pnpm dlx tailwindcss init -p text-white font-bold py-2 px-4 rounded-full" type="submit">Send</button>
    </form>
  )
}
