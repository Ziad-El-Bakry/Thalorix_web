import UserHeader from "@/components/ui/UserHeader";
import UploadFlow from "@/components/features/marketplace/UploadFlow";

export default function MarketplaceUploadPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full overflow-y-auto custom-scrollbar pb-10">
      <UserHeader name="User" badge="Developer" />
      <UploadFlow />
    </div>
  );
}
