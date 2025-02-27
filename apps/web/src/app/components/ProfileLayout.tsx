import BondList from "../bond-list";
import Score from "./Score";

interface ProfileLayoutProps {
  address?: string;
  title: string;
}

export default function ProfileLayout({
  address,
  title,
}: ProfileLayoutProps): JSX.Element {
  const shortAddress = address
    ? `0x${address.slice(2, 6)}...${address.slice(-4)}`
    : "";
  return (
    <div className="flex flex-col gap-4">
      <h1>
        {title} {shortAddress}
      </h1>
      <section className="w-full max-w-md bg-white/5 rounded-lg p-6">
        <Score address={address} />
      </section>
      <BondList address={address} />
    </div>
  );
}
