import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, viewAllHref, action }: SectionHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    }}>
      <h2 style={{
        fontSize: 16,
        fontWeight: 700,
        color: '#103B40',
      }}>
        {title}
      </h2>
      
      {viewAllHref && (
        <Link href={viewAllHref} style={{
          fontSize: 13,
          fontWeight: 650,
          color: '#346C73',
          textDecoration: 'none',
        }}>
          View All
        </Link>
      )}
      
      {action && action}
    </div>
  );
}
