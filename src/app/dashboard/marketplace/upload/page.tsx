import UserHeader from "@/components/ui/UserHeader";
import UploadFlow from "@/components/features/marketplace/UploadFlow";

export default function MarketplaceUploadPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full overflow-y-auto custom-scrollbar pb-10">
      <div className="border-b-2 border-[#b0c4c4] pb-2 mb-4 relative z-50">
        <UserHeader compact />
      </div>
      <UploadFlow />
    </div>
  );
}
