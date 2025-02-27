"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreatePage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  return (
    <div className="container mx-auto">
      <h1>Create New Trust Bond</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <form className="space-y-6">
          {/* Add form fields here later */}
          <p className="text-gray-500 text-center">Form coming soon...</p>
        </form>
      </div>
    </div>
  );
}
