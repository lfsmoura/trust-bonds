import CommunityPool from "./community-pool";
import HomeContent from "./components/HomeContent";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col items-center gap-4 min-h-screen p-24">
      <CommunityPool />
      <HomeContent />
    </main>
  );
}
