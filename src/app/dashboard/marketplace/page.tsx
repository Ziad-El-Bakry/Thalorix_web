import Sidebar from "@/components/layout/Sidebar";

export default function MarketplacePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
{/* <Sidebar /> */}
      <main className="flex-1 px-20 py-50 md:px-60 lg:px-100">
        <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
        <p>Explore and share templates with the community.</p>
      </main>
    </div>
  );
}