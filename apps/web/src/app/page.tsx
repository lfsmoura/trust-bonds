import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SendTransaction } from "./components/send-transaction";
import BondList from "./bond-list";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center gap-4 min-h-screen p-24">
      <h1 className="text-4xl font-bold">TrustBonds</h1>
      <ConnectButton />
      <BondList />
      <SendTransaction />
    </main>
  );
}
