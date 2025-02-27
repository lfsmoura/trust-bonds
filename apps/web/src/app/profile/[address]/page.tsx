import { ConnectButton } from "@rainbow-me/rainbowkit";
import BondList from "../../bond-list";
import Score from "../../components/Score";

export default function ProfilePage({
  params,
}: {
  params: { address: string };
}): JSX.Element {
  return (
    <main className="flex flex-col items-center gap-4 min-h-screen p-24">
      <h1 className="text-4xl font-bold">Profile</h1>
      <ConnectButton />
      <section className="w-full max-w-md bg-white/5 rounded-lg p-6">
        <Score address={params.address} />
      </section>
      <div className="text-xl">
        Viewing bonds for: <code>{params.address}</code>
      </div>
      <BondList address={params.address} />
    </main>
  );
}
