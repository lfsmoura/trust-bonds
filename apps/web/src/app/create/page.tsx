"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CreateForm } from "./CreateForm";

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
      <CreateForm />
    </div>
  );
}
