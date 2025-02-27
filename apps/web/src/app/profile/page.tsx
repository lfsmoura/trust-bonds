import BondList from "../bond-list";
import Score from "../components/Score";

export default function MyProfilePage(): JSX.Element {
  return (
    <main className="flex flex-col items-start gap-6 min-h-screen p-12">
      <h2 className="text-3xl font-bold mb-4">My Profile</h2>
      <section className="w-full max-w-md bg-white/5 rounded-lg p-6">
        <Score />
      </section>
      <div className="text-2xl mt-6 mb-4">My Bonds</div>
      <BondList address={undefined} />
    </main>
  );
}
