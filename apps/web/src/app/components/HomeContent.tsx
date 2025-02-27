import Link from "next/link";

export default function HomeContent() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Welcome to TrustBonds</h2>
        <p className="text-lg mb-4">
          A public good initiative enabling trust-based financial relationships
          in Web3, created by Kernel Block 9 participants. Build reputation,
          earn yields, and participate in community-driven finance.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-3">Core Features</h3>
          <ul className="space-y-2">
            <li>• Create trust bonds with equal contributions</li>
            <li>• Earn higher yields through coordination</li>
            <li>• Build on-chain reputation</li>
            <li>• Access community rewards pool</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-3">Technology Stack</h3>
          <ul className="space-y-2">
            <li>• Aave for liquidity markets</li>
            <li>• Gitcoin Passport for identity verification</li>
            <li>• Community Reward Points (CRP)</li>
            <li>• Transparent blockchain verification</li>
          </ul>
        </div>
      </div>

      <section className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">How Bonds Work</h3>
        <p className="text-lg mb-8">
          Members contribute equally to shared accounts, building trust through
          transparent interactions. Bonds can be dissolved by mutual agreement
          (1% fee) or broken by withdrawals (4% fee). All fees contribute to the
          community pool, which distributes rewards to active participants.
        </p>
      </section>

      <section className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
        <h3 className="text-2xl font-semibold mb-4">
          Modular Carnival Hackathon Project
        </h3>
        <p className="text-lg mb-6">
          TrustBonds is being developed for the Modular Carnival Hackathon in
          Belo Horizonte. We chose Scroll as our Layer 2 solution because of its
          EVM compatibility, high performance, and strong developer support.
        </p>
        <div className="bg-white p-6 rounded-lg mb-6">
          <h4 className="text-xl font-semibold mb-3">Why Scroll?</h4>
          <ul className="text-left space-y-2 mb-4">
            <li>• Native EVM compatibility for seamless Aave integration</li>
            <li>• Low transaction costs for frequent community interactions</li>
            <li>• Sepolia testnet for safe development and testing</li>
            <li>• Strong commitment to decentralization and security</li>
          </ul>
        </div>
        <Link
          href="/create"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Your First Trust Bond
        </Link>
      </section>
    </div>
  );
}
