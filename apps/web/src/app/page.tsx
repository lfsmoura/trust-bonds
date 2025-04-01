import CommunityPool from "./community-pool";
import HomeContent from "./components/HomeContent";

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <CommunityPool />
      <HomeContent />
    </div>
  );
}
