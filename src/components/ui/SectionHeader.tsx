import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, viewAllHref, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <h2 className="text-base md:text-lg font-bold text-[#103B40]">
        {title}
      </h2>
      
      {viewAllHref && (
        <Link href={viewAllHref} className="text-[13px] md:text-sm font-semibold text-[#346C73] hover:underline decoration-2 underline-offset-4">
          View All
        </Link>
      )}
      
      {action && action}
    </div>
  );
}
